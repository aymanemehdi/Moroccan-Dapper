'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function register(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  }

  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  const host = forwardedHost ?? requestHeaders.get('host')
  const forwardedProto = requestHeaders.get('x-forwarded-proto')
  const protocol = forwardedProto?.split(',')[0] ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')
  const requestOrigin = host ? `${protocol}://${host}` : null
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? requestOrigin ?? 'http://localhost:3000').replace(/\/+$/, '')

  const { data: authData, error } = await supabase.auth.signUp({
    ...data,
    options: {
      ...data.options,
      emailRedirectTo: new URL('/auth/callback', baseUrl).toString(),
    },
  })

  if (error) {
    return { error: error.message }
  }

                                                  
  if (!authData.session) {
    return { needsConfirmation: true }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
