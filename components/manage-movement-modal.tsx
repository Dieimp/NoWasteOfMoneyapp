"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"

interface MovementTemplate {
    id: string;
    name: string;
    description: string;
    movementTypeId: number;
}

interface ManageMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: MovementTemplate | null;
}

export function ManageMovementModal({ isOpen, onClose, onSuccess, initialData }: ManageMovementModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [movementTypeId, setMovementTypeId] = useState("1") // 1: Debit, 2: Credit
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const isEditMode = !!initialData;

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name)
                setDescription(initialData.description || "")
                setMovementTypeId(initialData.movementTypeId.toString())
            } else {
                setName("")
                setDescription("")
                setMovementTypeId("1")
            }
            setError("")
        }
    }, [isOpen, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!name.trim()) {
            setError("O nome é obrigatório.")
            return
        }

        setIsSubmitting(true)

        try {
            const url = isEditMode ? `/api/movements?id=${initialData.id}` : "/api/movements"
            const method = isEditMode ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description: description || name,
                    movementTypeId: parseInt(movementTypeId)
                })
            })

            if (res.ok) {
                onSuccess()
                onClose()
            } else {
                const errData = await res.json().catch(() => null)
                setError(errData?.error || `Erro ao ${isEditMode ? "atualizar" : "criar"} tipo de movimentação.`)
            }
        } catch (err) {
            console.error(err)
            setError(`Erro de rede ao ${isEditMode ? "atualizar" : "criar"} tipo de movimentação.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
            <div
                className="w-full max-w-sm bg-background px-6 pb-8 pt-6 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">
                        {isEditMode ? "Editar Categoria" : "Nova Categoria"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-xs text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Nome
                        </label>
                        <input
                            title="Nome"
                            placeholder="Ex: Aluguel, Salário..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Descrição
                        </label>
                        <input
                            title="Descrição"
                            placeholder="Breve descrição (opcional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setMovementTypeId("1")}
                                className={`flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${movementTypeId === "1"
                                        ? "bg-destructive/10 border-destructive text-destructive"
                                        : "border-input hover:bg-muted"
                                    }`}
                            >
                                Saída (Débito)
                            </button>
                            <button
                                type="button"
                                onClick={() => setMovementTypeId("2")}
                                className={`flex h-11 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${movementTypeId === "2"
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                                        : "border-input hover:bg-muted"
                                    }`}
                            >
                                Entrada (Crédito)
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Categoria"}
                    </button>
                </form>
            </div>
        </div>
    )
}
