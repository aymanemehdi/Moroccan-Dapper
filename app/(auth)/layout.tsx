import Link from 'next/link'
import { Gem, Instagram, Mail, Ruler, Scissors, Shirt, Watch } from 'lucide-react'
import { PublicNavbar } from '@/components/PublicNavbar'
import { SubscribeForm } from '@/components/newsletter/SubscribeForm'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('name')

  return (
    <div className="public-shell auth-shell min-h-screen bg-white text-foreground">
      <PublicNavbar categories={categories ?? []} />
      <main className="relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute inset-0 select-none text-black" aria-hidden="true">
          <Scissors className="absolute left-[8%] top-12 h-5 w-5 -rotate-12 text-black opacity-15" strokeWidth={1.5} />
          <Shirt className="absolute left-[22%] bottom-16 h-6 w-6 rotate-12 opacity-15" strokeWidth={1.5} />
          <Watch className="absolute left-[10%] bottom-28 h-5 w-5 rotate-6 opacity-15" strokeWidth={1.5} />
          <Ruler className="absolute right-[14%] top-20 h-5 w-5 -rotate-45 opacity-15" strokeWidth={1.5} />
          <Gem className="absolute right-[25%] bottom-20 h-5 w-5 rotate-45 opacity-15" strokeWidth={1.5} />
          <Scissors className="absolute right-[8%] bottom-32 h-5 w-5 rotate-90 opacity-15" strokeWidth={1.5} />
          <Shirt className="absolute left-[36%] top-8 h-5 w-5 -rotate-12 opacity-15" strokeWidth={1.5} />
          <Watch className="absolute right-[38%] top-12 h-5 w-5 rotate-12 opacity-15" strokeWidth={1.5} />
        </div>
        <div className="relative z-10 w-full max-w-md animate-page">
          <Link href="/" className="mb-6 flex flex-col items-center text-center">
            <h1 className="brand-name text-2xl tracking-tight text-foreground">Moroccan Dapper</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to the editorial desk</p>
          </Link>
          <div className="border-2 border-black bg-[#fff4e3] shadow-[6px_6px_0_0_#000]">
            {children}
          </div>
        </div>
      </main>
      <footer className="border-t-[3px] border-black bg-white">
        <div className="border-b-[3px] border-black bg-white px-4 py-8">
          <SubscribeForm className="mt-0" />
        </div>
        <div className="container mx-auto flex max-w-6xl flex-col gap-6 bg-white px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="brand-name text-base text-foreground">Moroccan Dapper</p>
            <p className="mt-1 text-xs text-muted-foreground">Style notes, culture, and dispatches.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/" className="border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Home</Link>
            <Link href="/blog" className="border-2 border-black bg-accent px-3 py-1 shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Articles</Link>
            <Link href="https://www.instagram.com/moroccandapper" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
              <Instagram className="h-4 w-4" />
              Instagram
            </Link>
            <a href="mailto:moroccandapper@gmail.com" className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
              <Mail className="h-4 w-4" />
              moroccandapper@gmail.com
            </a>
          </div>
        </div>
        <div className="border-t border-black/10 bg-white py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Moroccan Dapper. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
