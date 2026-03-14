import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 403 }
            )
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        // We'll fetch pages of movements. Typically page 1, size 100 to get a good list for the combobox
        const url = `${apiUrl}/api/Movement?pageNumber=1&pageSize=100`

        const backendResponse = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || "Erro ao buscar tipos de movimentação" },
                { status: backendResponse.status }
            )
        }

        const envelope = await backendResponse.json()
        const data = envelope.data || envelope.Data || envelope;

        // If the backend is using EnvelopeFilter, and it was a PagedResult, 
        // the Data property IS the items array directly.
        if (Array.isArray(data)) {
            return NextResponse.json(data);
        }

        // Fallback for regular PagedResult or other structures
        const items = data.items || data.Items || [];
        return NextResponse.json(items)
    } catch (error) {
        console.error("Movements fetch proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 403 }
            )
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const body = await request.json()

        // Backend expects CreateMovementRequest record (Name, Description, MovementTypeId)
        const { name, description, movementTypeId } = body;

        if (!name || !description || !movementTypeId) {
            return NextResponse.json(
                { error: "Nome, descrição e tipo são obrigatórios." },
                { status: 400 }
            )
        }

        const url = `${apiUrl}/api/Movement`

        const backendResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                movementTypeId: parseInt(movementTypeId.toString())
            })
        })

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || errorData?.message || "Erro ao criar novo tipo de movimentação" },
                { status: backendResponse.status }
            )
        }

        const data = await backendResponse.json();
        return NextResponse.json(data)
    } catch (error) {
        console.error("Movements POST proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}

