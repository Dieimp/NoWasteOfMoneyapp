"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import type { Transaction } from "@/lib/transactions-data"

interface MovementTemplate {
    id: string;
    name: string;
    movementTypeId: number;
}

interface EditMovementModalProps {
    isOpen: boolean;
    transaction: Transaction | null;
    baseDateStr: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditMovementModal({ isOpen, transaction, baseDateStr, onClose, onSuccess }: EditMovementModalProps) {
    const [movements, setMovements] = useState<MovementTemplate[]>([])
    const [isLoadingMovements, setIsLoadingMovements] = useState(false)

    const [selectedMovementId, setSelectedMovementId] = useState("")
    const [value, setValue] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // When the modal opens, pre-fill with the existing transaction data
    useEffect(() => {
        if (isOpen && transaction) {
            setValue(String(transaction.amount))
            // Pre-select the movement if the transaction carries it
            setSelectedMovementId(transaction.movementId ?? "")
            setError("")
        }
    }, [isOpen, transaction])

    // Fetch movement templates once
    useEffect(() => {
        if (isOpen && movements.length === 0) {
            fetchMovements()
        }
    }, [isOpen])

    const fetchMovements = async () => {
        setIsLoadingMovements(true)
        try {
            const res = await fetch("/api/movements")
            if (res.status === 401) {
                window.location.href = "/login"
                return
            }
            if (res.ok) {
                const data = await res.json()
                setMovements(data.map((m: any) => ({
                    id: m.id || m.Id,
                    name: m.name || m.Name,
                    movementTypeId: m.movementTypeId || m.MovementTypeId || 1,
                })))
            }
        } catch (err) {
            console.error("Erro ao buscar tipos de movimentação:", err)
        } finally {
            setIsLoadingMovements(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!selectedMovementId) {
            setError("Selecione um tipo de movimentação.")
            return
        }

        const numValue = parseFloat(value.replace(",", "."))
        if (isNaN(numValue) || numValue <= 0) {
            setError("Insira um valor válido maior que zero.")
            return
        }

        if (!transaction) return
        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/month-movements/${transaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movementId: selectedMovementId,
                    date: baseDateStr,
                    value: numValue,
                }),
            })

            if (res.status === 401) {
                window.location.href = "/login"
                return
            }

            if (res.ok) {
                onSuccess()
                onClose()
            } else {
                const errData = await res.json().catch(() => null)
                setError(errData?.error || "Erro ao atualizar movimentação.")
            }
        } catch (err) {
            console.error(err)
            setError("Erro de rede ao atualizar movimentação.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen || !transaction) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
            <div className="w-full max-w-md bg-background px-6 pb-8 pt-6 shadow-xl sm:rounded-2xl rounded-t-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Editar Movimentação</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Movement type selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Tipo de Movimentação
                        </label>
                        <select
                            title="Selecione a movimentação"
                            value={selectedMovementId}
                            onChange={(e) => setSelectedMovementId(e.target.value)}
                            className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isLoadingMovements || isSubmitting}
                        >
                            <option value="" disabled>Selecione uma opção...</option>
                            {movements.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        {isLoadingMovements && (
                            <p className="text-xs text-muted-foreground">Carregando opções...</p>
                        )}
                    </div>

                    {/* Value input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            Valor (R$)
                        </label>
                        <input
                            type="number"
                            title="Valor"
                            placeholder="0,00"
                            step="0.01"
                            min="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingMovements}
                        className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        </div>
    )
}
