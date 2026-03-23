import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        console.log("entrou no rtoute ts")
        const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"
        const { searchParams } = new URL(request.url)

        let personId = searchParams.get("personId")
        const date = searchParams.get("date")

        // Se o personId vier vazio do cookie (sessão antiga), decodifica o JWT para pegar a claim
        if (!personId && accessToken) {
            try {
                const payloadPart = accessToken.split('.')[1];
                const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = Buffer.from(base64, 'base64').toString('utf-8');
                const claims = JSON.parse(decodedPayload);
                personId = claims.PersonId || claims.personId;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }

        if (!personId || !date) {
            return NextResponse.json(
                { error: "personId e date são obrigatórios" },
                { status: 400 }
            )
        }

        const url = `${apiUrl}/api/MonthMovements/person/${personId}/resume/${date}`

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
                { error: errorData?.detail || "Erro ao buscar resumo do mês" },
                { status: backendResponse.status }
            )
        }

        const envelope = await backendResponse.json()

        // If the backend wraps the response in an envelope (e.g. { data: { movements: [], total: 0 }})
        // we unwrap it here so page.tsx can read it natively or we just return the unwrapped version
        const data = envelope.data || envelope;

        return NextResponse.json(data)
    } catch (error) {
        console.error("MonthMovements resume proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
