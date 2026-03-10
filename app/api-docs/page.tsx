import type { Metadata } from "next"
import { ApiDocsScreen } from "@/components/api-docs-screen"

export const metadata: Metadata = {
    title: "API Docs | Minhas Finanças",
    description: "Documentação da API e teste de conexão",
}

export default function ApiDocsPage() {
    return (
        <main className="mx-auto min-h-dvh w-full max-w-4xl">
            <ApiDocsScreen />
        </main>
    )
}
