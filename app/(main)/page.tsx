import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs/app-beta'

export default function Home() {
  return (
    <main>
      <div>
        <UserButton afterSignOutUrl="/"/>
     </div>
    </main>
  )
}
