"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Wallet, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Credenciais inválidas")
        return
      }

      // Login successful — JWT is now stored in HTTP-only cookie
      // Redirect to home page
      router.push("/")
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background animate-in fade-in duration-500">
      {/* Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.38_0.18_270)] via-[oklch(0.35_0.20_265)] to-[oklch(0.30_0.15_250)] px-5 pb-16 pt-16">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[oklch(0.98_0_0)]/5" />
        <div className="absolute -left-4 bottom-4 h-20 w-20 rounded-full bg-[oklch(0.98_0_0)]/5" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[oklch(0.98_0_0)]/15 shadow-lg backdrop-blur-sm">
            <Wallet className="h-7 w-7 text-[oklch(0.95_0_0)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[oklch(0.98_0_0)]">
              Minhas Finanças
            </h1>
            <p className="mt-1 text-sm text-[oklch(0.78_0.06_265)]">
              Entre na sua conta para continuar
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="-mt-6 flex flex-1 flex-col rounded-t-3xl bg-background px-6 pb-8 pt-8 shadow-[0_-4px_20px_oklch(0_0_0/0.06)]">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 pl-10 text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-10 pr-10 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked as boolean)
                }
              />
              <Label
                htmlFor="remember"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                Lembrar de mim
              </Label>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-[oklch(0.38_0.18_270)] to-[oklch(0.35_0.20_265)] text-sm font-semibold text-[oklch(0.98_0_0)] shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[oklch(0.98_0_0)]/30 border-t-[oklch(0.98_0_0)]" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Create Account Button */}
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Criar conta
          </Button>

          {/* Footer */}
          <div className="mt-auto pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ao entrar, você concorda com nossos{" "}
              <button type="button" className="font-medium text-primary underline-offset-2 hover:underline">
                Termos de Uso
              </button>{" "}
              e{" "}
              <button type="button" className="font-medium text-primary underline-offset-2 hover:underline">
                Política de Privacidade
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
