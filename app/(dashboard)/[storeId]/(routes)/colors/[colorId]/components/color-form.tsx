"use client";

import { Color } from '@prisma/client';
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

interface ColorFormProps {
    initData: Color | null
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be a valid hex code"
    })
})

type ColorFormvalues = z.infer<typeof formSchema>


const ColorForm: React.FC<ColorFormProps> = ({ initData }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initData ? "Edit color" : "Create color"
    const desc = initData ? "Edit color" : "Create color"
    const toastMsg = initData ? "Color updated" : "Color created"
    const action = initData ? "Save changes" : "Create"


    const params = useParams()
    const router = useRouter()

    const form = useForm<ColorFormvalues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData || { name: '', value: '' }
    })

    const onSubmit = async (data: ColorFormvalues) => {
        try {
            setLoading(true)
            if (initData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("Color deleted")
        }
        catch (error) {
            toast.error("Make sure you removed all products using this size first.")
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
                                    <Input disabled={loading} placeholder='Color name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )} />
                        <FormField control={form.control} name="value" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className='flex items-center gap-x-4'>
                                        <Input disabled={loading} placeholder='Color value' {...field} />
                                        <div className='border p-4 rounded-full' style={{ backgroundColor: field.value }} />
                                    </div>
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

export default ColorForm