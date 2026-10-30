/**
 * EnrollMFA shows an enrollment dialog. When shown on screen it calls
 * the `enroll` API and shows the QR code. Each time a user clicks the Enable
 * button it calls the `challenge` and `verify` APIs to check if the code
 * provided by the user is valid.
 * When enrollment is successful (or the user already has a factor), it calls
 * `onEnrolled`. When the user clicks Cancel the `onCancelled` callback is called.
 */
"use client"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const supabase = createClient()

export default function EnrollMFA({
  onEnrolled,
  onCancelled,
}: {
  onEnrolled: () => void
  onCancelled: () => void
}) {
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('') // holds the QR code image SVG
  const [secret, setSecret] = useState('') // for typing into the app by hand
  const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user
  const [error, setError] = useState('') // holds an error message
  const [isLoading, setIsLoading] = useState(false)
  // React runs effects twice in dev; without this we'd enroll two factors.
  const started = useRef(false)

  const onEnableClicked = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // challengeAndVerify = `challenge` + `verify` in one call.
    // On success the session is upgraded to aal2.
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: verifyCode,
    })
    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    onEnrolled()
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    ;(async () => {
      const factors = await supabase.auth.mfa.listFactors()
      if (factors.error) {
        setError(factors.error.message)
        return
      }

      // Already set up, nothing to do.
      if (factors.data.totp.length > 0) {
        onEnrolled()
        return
      }

      // A previous enrollment that was never verified blocks a new one, so remove it.
      for (const factor of factors.data.all) {
        if (factor.factor_type === "totp" && factor.status === "unverified") {
          await supabase.auth.mfa.unenroll({ factorId: factor.id })
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })
      if (error) {
        setError(error.message)
        return
      }

      setFactorId(data.id)

      // Supabase Auth returns an SVG QR code which you can convert into a data
      // URL that you can place in an <img> tag.
      setQR(data.totp.qr_code)
      setSecret(data.totp.secret)
    })()
  }, [onEnrolled])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Set up two-factor authentication</CardTitle>
        <CardDescription>
          Scan the QR code with an authenticator app (Google Authenticator,
          Microsoft Authenticator, 1Password, etc.), then enter the 6-digit
          code it shows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onEnableClicked} className="flex flex-col gap-4">
          {qr ? (
            <>
              <img src={qr} alt="QR code for your authenticator app" className="mx-auto h-48 w-48 bg-white p-2 rounded" />
              <p className="text-xs text-muted-foreground break-all">
                Can&apos;t scan it? Enter this key in your app: <span className="font-mono">{secret}</span>
              </p>
            </>
          ) : (
            !error && <p className="text-sm text-muted-foreground">Loading...</p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="mfa-code">6-digit code</Label>
            <Input
              id="mfa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.trim())}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading || !factorId}>
              {isLoading ? "Verifying..." : "Enable"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onCancelled}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
