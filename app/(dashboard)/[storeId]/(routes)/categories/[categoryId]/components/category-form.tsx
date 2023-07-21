"use client";

import { Billboard, Category } from '@prisma/client';
import React, { useState } from 'react'
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import AlertModal from '@/components/ui/modals/alert-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormmProps {
    initData: Category | null,
    billboards: Billboard[]
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormmValues = z.infer<typeof formSchema>


const CategoryForm: React.FC<CategoryFormmProps> = ({ initData, billboards }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initData ? "Edit a category" : "Create a category"
    const desc = initData ? "Edit a category" : "Create a category"
    const toastMsg = initData ? "Category updated" : "category created"
    const action = initData ? "Save changes" : "Create"


    const params = useParams()
    const router = useRouter()

    const form = useForm<CategoryFormmValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || { name: '', billboardId: '' }
    })

    const onSubmit = async (data: CategoryFormmValues) => {
        try {
            setLoading(true)
            if (initData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)

            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMsg)
        }
        catch (error) {
            toast.error("Make sure you have deleted all products using this category first.")
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted")
        }
        catch (error) {
            toast.error("Make sure you removed all categories in the categorys first.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => onDelete()} loading={loading} />
            <div className='flex items-center justify-between'>
                <Heading title={title} desc={desc} />
                {initData && (
                    <Button disabled={loading} variant={"destructive"} size={"icon"} onClick={() => { setOpen(true) }}>
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Category name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="billboardId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select billboard'>

                                            </SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map((billboard) => (
                                            <SelectItem key={billboard.id} value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} className='ml-auto' typeof='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default CategoryForm