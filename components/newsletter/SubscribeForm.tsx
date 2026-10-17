'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormValues = z.infer<typeof schema>

interface SubscribeFormProps {
  className?: string
}

export function SubscribeForm({ className = '' }: SubscribeFormProps) {
  const [subscribed, setSubscribed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const json = await res.json().catch(() => null)
      if (json?.success) {
        setSubscribed(true)
        toast.success(json.message)
      } else {
        toast.error(json?.message ?? 'Something went wrong')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  if (subscribed) {
    return (
      <div className={cn('mx-auto mt-12 max-w-lg border-2 border-black bg-[#fff4e3] p-8 text-center shadow-[4px_4px_0_0_#000]', className)}>
        <p className="text-lg font-semibold">You&apos;re subscribed!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ll get an email when the next post is published.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('mx-auto mt-12 max-w-lg border-2 border-black bg-[#fff4e3] p-8 text-center shadow-[4px_4px_0_0_#000]', className)}>
      <p className="mb-2 inline-block border-2 border-black bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest">Newsletter</p>
      <h2 className="mb-1 text-xl font-bold">Stay in the loop</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Get notified when new posts are published. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-sm items-stretch flex-col gap-2 sm:flex-row">
        <label htmlFor="subscribe-email" className="sr-only">Email address</label>
        <Input
          {...register('email')}
          id="subscribe-email"
          type="email"
          placeholder="your@email.com"
          className="h-11 flex-1 border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus-visible:border-black focus-visible:ring-0"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting} className="h-11 min-w-[116px] border-2 border-black bg-primary px-5 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {errors.email && (
        <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">No spam · Unsubscribe anytime</p>
    </div>
  )
}
