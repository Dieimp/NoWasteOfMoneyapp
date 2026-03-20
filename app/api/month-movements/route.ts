import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const { searchParams } = new URL(request.url)

        // Build query string from search params
        const queryString = searchParams.toString()
        const url = `${apiUrl}/api/MonthMovements${queryString ? `?${queryString}` : ""}`

        const backendResponse = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })

        if (!backendResponse.ok) {
            if (backendResponse.status === 401 || backendResponse.status === 403) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || "Erro ao buscar movimentos" },
                { status: backendResponse.status }
            )
        }

        const data = await backendResponse.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("MonthMovements proxy error:", error)
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
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const body = await request.json()

        const { personId, movementId, date, value } = body;

        let effectivePersonId = personId;
        if (!effectivePersonId) {
            try {
                const payloadPart = accessToken.split('.')[1];
                const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = Buffer.from(base64, 'base64').toString('utf-8');
                const claims = JSON.parse(decodedPayload);
                effectivePersonId = claims.PersonId || claims.personId;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }

        if (!effectivePersonId || !movementId || !date || value === undefined) {
            return NextResponse.json(
                { error: "Dados inválidos: personId, movementId, date e value são obrigatórios." },
                { status: 400 }
            )
        }

        const url = `${apiUrl}/api/MonthMovements/${effectivePersonId}`

        const backendResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                movementId,
                date,
                value
            })
        })

        if (!backendResponse.ok) {
            if (backendResponse.status === 401 || backendResponse.status === 403) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || errorData?.message || "Erro ao criar nova movimentação" },
                { status: backendResponse.status }
            )
        }

        // Just returning the newly created ID, usually backend responses with string or simple object here
        const data = await backendResponse.json();
        return NextResponse.json(data)
    } catch (error) {
        console.error("MonthMovements POST proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
