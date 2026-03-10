"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, XCircle, Loader2, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ConnectionStatus = "idle" | "loading" | "connected" | "error"

export function ApiDocsScreen() {
    const [status, setStatus] = useState<ConnectionStatus>("idle")
    const [responseInfo, setResponseInfo] = useState<string>("")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5018"

    const testConnection = async () => {
        setStatus("loading")
        setResponseInfo("")
        try {
            const res = await fetch(`${apiUrl}/swagger/index.html`, {
                method: "HEAD",
                mode: "no-cors",
            })
            // no-cors won't give us status, but if it doesn't throw, the server is reachable
            setStatus("connected")
            setResponseInfo(`Servidor alcançável em ${apiUrl}`)
        } catch (err) {
            setStatus("error")
            setResponseInfo(
                err instanceof Error ? err.message : "Não foi possível conectar ao servidor"
            )
        }
    }

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-[oklch(0.38_0.18_270)] via-[oklch(0.35_0.20_265)] to-[oklch(0.30_0.15_250)] px-5 pb-6 pt-6">
                <Link
                    href="/"
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-[oklch(0.85_0.05_265)] transition-colors hover:text-[oklch(0.95_0_0)]"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Voltar</span>
                </Link>
                <h1 className="text-xl font-bold text-[oklch(0.98_0_0)]">API & Documentação</h1>
                <p className="mt-1 text-sm text-[oklch(0.78_0.06_265)]">
                    Swagger docs e teste de conexão — {apiUrl}
                </p>
            </div>

            {/* Connection Test Card */}
            <div className="-mt-3 mx-4 rounded-xl bg-card p-4 shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {status === "idle" && (
                            <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
                        )}
                        {status === "loading" && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {status === "connected" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {status === "error" && (
                            <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <div>
                            <p className="text-sm font-semibold text-card-foreground">
                                {status === "idle" && "Conexão não testada"}
                                {status === "loading" && "Testando conexão..."}
                                {status === "connected" && "Conectado!"}
                                {status === "error" && "Falha na conexão"}
                            </p>
                            {responseInfo && (
                                <p className="text-xs text-muted-foreground">{responseInfo}</p>
                            )}
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={testConnection}
                        disabled={status === "loading"}
                        className="gap-1.5"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
                        Testar
                    </Button>
                </div>
            </div>

            {/* Open in new tab link */}
            <div className="mx-4 mt-3 flex justify-end">
                <a
                    href={`${apiUrl}/swagger/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                    Abrir Swagger em nova aba
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>

            {/* Swagger Iframe */}
            <div className="mx-4 mt-2 mb-4 flex-1 overflow-hidden rounded-xl border bg-card shadow-sm">
                <iframe
                    src={`${apiUrl}/swagger/index.html`}
                    title="Swagger API Documentation"
                    className="h-full min-h-[600px] w-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
            </div>
        </div>
    )
}
