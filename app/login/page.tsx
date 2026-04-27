import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
    title: "Login | NoWasteOfMoney",
    description: "Entre na sua conta para gerenciar suas finanças",
}

export default function LoginPage() {
    return (
        <main className="mx-auto min-h-dvh w-full max-w-md">
            <LoginForm />
        </main>
    )
}
