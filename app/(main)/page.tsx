import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs/app-beta'
import { ModeToggle } from '@/components/Theme-Switcher'

export default function Home() {
  return (
    <main>
      <div>
        <UserButton afterSignOutUrl="/"/>
     </div>
     <div>
      <ModeToggle/>
     </div>
    </main>
  )
}
