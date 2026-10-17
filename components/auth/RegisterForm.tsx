'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { AlertCircle, Loader2, Mail, Lock, User, CheckCircle2 } from 'lucide-react'
import { register as registerAction } from '@/app/(auth)/register/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.set('email', values.email)
    formData.set('password', values.password)
    formData.set('full_name', values.full_name)
    const result = await registerAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.needsConfirmation) {
      setNeedsConfirmation(true)
      setLoading(false)
    } else if (result?.success) {
      router.push('/dashboard')
    }
  }

  if (needsConfirmation) {
    return (
      <div className="p-8 text-center animate-in fade-in duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">Check your email</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          We sent a confirmation link to your email. Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="text-sm font-bold text-foreground underline underline-offset-4 hover:text-black"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Start writing and managing your content</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-sm font-bold text-foreground">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              id="full_name"
              placeholder="Jane Smith"
              className="h-11 border-2 border-black bg-white pl-9 shadow-[2px_2px_0_0_#000] focus-visible:border-black focus-visible:ring-0"
              {...register('full_name', { onChange: () => clearErrors('full_name') })}
            />
          </div>
          {errors.full_name && (
            <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in duration-150">
              <AlertCircle className="size-3 shrink-0" />{errors.full_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-bold text-foreground">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 border-2 border-black bg-white pl-9 shadow-[2px_2px_0_0_#000] focus-visible:border-black focus-visible:ring-0"
              {...register('email', { onChange: () => clearErrors('email') })}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in duration-150">
              <AlertCircle className="size-3 shrink-0" />{errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-bold text-foreground">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              className="h-11 border-2 border-black bg-white pl-9 shadow-[2px_2px_0_0_#000] focus-visible:border-black focus-visible:ring-0"
              {...register('password', { onChange: () => clearErrors('password') })}
            />
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in duration-150">
              <AlertCircle className="size-3 shrink-0" />{errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-bold text-foreground">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              className="h-11 border-2 border-black bg-white pl-9 shadow-[2px_2px_0_0_#000] focus-visible:border-black focus-visible:ring-0"
              {...register('confirmPassword', { onChange: () => clearErrors('confirmPassword') })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in duration-150">
              <AlertCircle className="size-3 shrink-0" />{errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full border-2 border-black bg-primary text-white shadow-[3px_3px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-foreground underline underline-offset-4 hover:text-black">
          Sign in
        </Link>
      </p>
    </div>
  )
}
