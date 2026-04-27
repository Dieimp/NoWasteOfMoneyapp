import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const { id } = await params

        if (!id) {
            return NextResponse.json(
                { error: "ID da movimentação é obrigatório." },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { movementId, value, date } = body

        if (!movementId || value === undefined || value === null || !date) {
            return NextResponse.json(
                { error: "movementId, value e date são obrigatórios." },
                { status: 400 }
            )
        }

        const numValue = parseFloat(value)
        if (isNaN(numValue) || numValue <= 0) {
            return NextResponse.json(
                { error: "O valor deve ser um número positivo maior que zero." },
                { status: 400 }
            )
        }

        const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const url = `${apiUrl}/api/MonthMovements/${id}`

        const backendResponse = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ movementId, date, value: numValue }),
        })

        if (!backendResponse.ok) {
            if (backendResponse.status === 401 || backendResponse.status === 403) {
                return NextResponse.redirect(new URL("/login", request.url))
            }
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || errorData?.message || "Erro ao atualizar movimentação" },
                { status: backendResponse.status }
            )
        }

        if (backendResponse.status === 204) {
            return new NextResponse(null, { status: 204 })
        }

        const data = await backendResponse.json().catch(() => null)
        return NextResponse.json(data ?? { success: true })
    } catch (error) {
        console.error("MonthMovements PUT proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}



export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        const { id } = await params

        if (!id) {
            return NextResponse.json(
                { error: "ID da movimentação é obrigatório." },
                { status: 400 }
            )
        }

        const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const url = `${apiUrl}/api/MonthMovements/${id}`

        const backendResponse = await fetch(url, {
            method: "DELETE",
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
                { error: errorData?.detail || errorData?.message || "Erro ao deletar movimentação" },
                { status: backendResponse.status }
            )
        }

        // Some DELETE endpoints return 204 No Content
        if (backendResponse.status === 204) {
            return new NextResponse(null, { status: 204 })
        }

        const data = await backendResponse.json().catch(() => null)
        return NextResponse.json(data ?? { success: true })
    } catch (error) {
        console.error("MonthMovements DELETE proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
