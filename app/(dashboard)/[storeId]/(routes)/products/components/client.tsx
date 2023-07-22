"use client";

import React from 'react'
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Products (${data.length})`} desc='Manage products for your store' />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title='Api' desc='API calls for products' />
            <Separator />
            <ApiList entityName='products' entityIdName='productId' />
        </>
    )
}

export { ProductClient }