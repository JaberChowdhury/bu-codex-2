"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      })
      const result = await response.json().catch(() => ({ success: false }))
      if (!response.ok || !result.success) {
        setError(result.error || "Login failed")
      } else {
        window.location.reload()
      }
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center font-heading text-xl">
          ADMIN LOGIN
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-mono text-xs text-muted-foreground uppercase"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-mono text-xs text-muted-foreground uppercase"
            >
              Password
            </Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && (
            <p className="font-mono text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
