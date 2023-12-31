import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'

import { MainNav } from "@/components/main-nav"
import StoreSwitcher from './ui/store-switcher'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'
import { ThemeToggle } from './theme-toggle'

const Navbar = async () => {
    const { userId } = auth()
    if (!userId) {
        redirect("/sign-in")
    }
    const allStores = await prismadb.store.findMany({
        where: {
            userId: userId
        }
    })
    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <StoreSwitcher items={allStores} />
                <MainNav className='mx-6' />
                <div className='ml-auto flex items-center space-x-4'>
                    <UserButton afterSignOutUrl='/' />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )
}

export default Navbar