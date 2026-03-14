import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"

        const backendResponse = await fetch(`${apiUrl}/api/User/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json().catch(() => null)
            return NextResponse.json(
                { error: errorData?.detail || "Credenciais inválidas" },
                { status: backendResponse.status }
            )
        }

        const envelope = await backendResponse.json()
        const data = envelope.data
        // data: { accessToken, expiresAt, name, email }

        const expiresAt = new Date(data.expiresAt)

        const response = NextResponse.json({
            name: data.name,
            email: data.email,
            personId: data.personId,
            expiresAt: data.expiresAt,
        })

        // Set JWT as HTTP-only cookie
        response.cookies.set("access_token", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        })

        // Set user info cookie (readable by client)
        response.cookies.set("user_info", JSON.stringify({
            name: data.name,
            email: data.email,
            personId: data.personId,
        }), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt,
        })

        return response
    } catch (error) {
        console.error("Login proxy error:", error)
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        )
    }
}
