"use client"

import { X, AlertTriangle, Loader2 } from "lucide-react"

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
    title?: string;
    message?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting = false,
    title = "Excluir Transação",
    message = "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
}: DeleteConfirmationModalProps) {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <div
                className="w-full max-w-sm bg-background p-6 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex h-11 items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex h-11 items-center justify-center rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
                    </button>
                </div>
            </div>
        </div>
    )
}
