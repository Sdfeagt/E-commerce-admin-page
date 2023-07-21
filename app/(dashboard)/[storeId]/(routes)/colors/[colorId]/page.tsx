import prismadb from '@/lib/prismadb'
import React from 'react'
import ColorForm from './components/color-form'

const ColorPage = async ({ params }: { params: { colorId: string } }) => {

    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    })
    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorForm initData={color} />
            </div>
        </div>
    )
}

export default ColorPage