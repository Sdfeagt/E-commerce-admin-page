"use client";

import { Store } from '@prisma/client';
import React, { useState } from 'react'
import * as z from "zod"
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

import Heading from './heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import AlertModal from '@/components/ui/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';

interface SettingsFormProps {
    initData: Store
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>


const SettingsForm: React.FC<SettingsFormProps> = ({ initData }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const router = useRouter()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initData
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store updated!")
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
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push("/")
            toast.success("Store deleted")
        }
        catch (error) {
            toast.error("Make sure you removed all products and categories first.")
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
                <Heading title="Settings" desc="Manage store preferences" />
                <Button disabled={loading} variant={"destructive"} size={"icon"} onClick={() => { setOpen(true) }}>
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Store name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} className='ml-auto' typeof='submit'>
                        Save changed
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title='NEXT_PUBLIC_API_URL' desc={`${origin}/api/${params.storeId}`} variant='public' />
        </>
    )
}

export default SettingsForm