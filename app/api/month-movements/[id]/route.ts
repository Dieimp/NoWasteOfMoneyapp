import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.json(
                { error: "Não autenticado" },
                { status: 403 }
            )
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const url = `${apiUrl}/api/MonthMovements/${id}`

        const backendResponse = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        })

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || "Erro ao excluir movimentação" },
                { status: backendResponse.status }
            )
        }

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("MonthMovements DELETE proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
