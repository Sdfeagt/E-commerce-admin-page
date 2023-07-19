import { auth } from '@clerk/nextjs'
import React from 'react'
import { redirect } from "next/navigation"

import prismadb from '@/lib/prismadb'

const DashboardLayout = async ({ children, params }: { children: React.ReactNode, params: { storeId: string } }) => {
    const { userId } = auth()

    if (!userId) {
        redirect("/sign-in")
    }
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect("/")
    }

    return (
        <>
            <div>
                Navbar here
            </div>
            {children}

        </>
    )
}

export default DashboardLayout