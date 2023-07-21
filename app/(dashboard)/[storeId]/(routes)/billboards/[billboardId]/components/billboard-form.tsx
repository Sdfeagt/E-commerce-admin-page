"use client";

import { Billboard } from '@prisma/client';
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
import ImageUpload from '@/components/ui/image-upload';

interface BillboardFormProps {
    initData: Billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>


const BillboardForm: React.FC<BillboardFormProps> = ({ initData }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initData ? "Edit a billboard" : "Create a billboard"
    const desc = initData ? "Edit a billboard" : "Create a billboard"
    const toastMsg = initData ? "Billboard updated" : "Billboard created"
    const action = initData ? "Save changes" : "Create"


    const params = useParams()
    const router = useRouter()

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || { label: '', imageUrl: '' }
    })

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            if (initData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)

            }
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMsg)
        }
        catch (error) {
            toast.error("Something went wrong!")
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted")
        }
        catch (error) {
            toast.error("Make sure you removed all categories in the billboards first.")
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
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background image</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="label" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Billboard label' {...field} />
                                </FormControl>
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

export default BillboardForm