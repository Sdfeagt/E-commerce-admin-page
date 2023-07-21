"use client";

import React from 'react'
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SizeColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SizesClientProps {
    data: SizeColumn[]
}

const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams()
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Sizes (${data.length})`} desc='Manage sizes for your store' />
                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title='Api' desc='API calls for sizes' />
            <Separator />
            <ApiList entityName='sizes' entityIdName='sizeId' />
        </>
    )
}

export { SizesClient }