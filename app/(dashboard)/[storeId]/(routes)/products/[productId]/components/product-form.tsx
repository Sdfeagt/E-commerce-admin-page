"use client";

import { Category, Color, Image, Product, Size } from '@prisma/client';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import AlertModal from '@/components/ui/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFormProps {
    initData: Product & {
        images: Image[]
    } | null,
    categories: Category[],
    sizes: Size[],
    colors: Color[]

}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()

})

type ProductFormValues = z.infer<typeof formSchema>


const ProductForm: React.FC<ProductFormProps> = ({ initData, categories, sizes, colors }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initData ? "Edit product" : "Create product"
    const desc = initData ? "Edit product" : "Create product"
    const toastMsg = initData ? "Product updated" : "Product created"
    const action = initData ? "Save changes" : "Create"


    const params = useParams()
    const router = useRouter()

    const defaultValues = initData ? {
        ...initData,
        price: parseFloat(String(initData?.price)),
    } : {
        name: '',
        images: [],
        price: 0,
        categoryId: '',
        colorId: '',
        sizeId: '',
        isFeatured: false,
        isArchived: false,
    }

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)

            }
            else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMsg)
        }
        catch (error) {
            console.log(error);
            toast.error("Something went wrong!")
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/product/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product deleted")
        }
        catch (error) {
            toast.error("Something went wrong.")
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
                    <FormField control={form.control} name="images" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value.map((image) => image.url)} disabled={loading} onChange={(url) => field.onChange([...field.value, { url }])} onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='9.99' {...field} type='number' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select category' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="sizeId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select a size' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sizes.map((size) => (
                                            <SelectItem key={size.id} value={size.id}>
                                                {size.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="colorId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder='Select a color' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {colors.map((color) => (
                                            <SelectItem key={color.id} value={color.id}>
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leadning-none'>
                                    <FormLabel>
                                        Featured
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isArchived" render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leadning-none'>
                                    <FormLabel>
                                        Archived
                                        <FormDescription>
                                            This product will not appear anywhere in the store
                                        </FormDescription>
                                    </FormLabel>
                                </div>
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

export default ProductForm