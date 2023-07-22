"use client";

import React from 'react'

import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    return (
        <>
            <Heading title={`Orders (${data.length})`} desc='Manage orders for your store' />
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    )
}

export { OrderClient }