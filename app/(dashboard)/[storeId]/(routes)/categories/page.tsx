import React from 'react'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns"

import { CategoriesClient } from './components/client'
import { CategoryColumn } from './components/columns'



const CategoriesPage = async ({ params }: { params: { storeid: string } }) => {

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeid
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: `desc`
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMM do, yyyy")
    }))


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoriesClient data={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoriesPage