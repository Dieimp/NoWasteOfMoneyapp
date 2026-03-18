import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 401 }
            )
        }

        const { id } = await params

        if (!id) {
            return NextResponse.json(
                { error: "ID da movimentação é obrigatório." },
                { status: 400 }
            )
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const url = `${apiUrl}/api/MonthMovements/${id}`

        const backendResponse = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })

        if (!backendResponse.ok) {
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
