"use client"

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { db } from '@/lib/db'
import Button from '@/components/ui/Button'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  
  const router = useRouter()

  return (
    <>
      <Button variant="default">Hello</Button>
      <button onClick={() => signOut()}>LogOut</button>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
    </>
  )
}
