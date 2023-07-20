import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATCH = async(req: Request, {params}: {params: {storeId: string}}) =>{
    try{
         const {userId} = auth()
         if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
         }
         const body = await req.json()
         const {name} = body
         if(!name){
            return new NextResponse("Name is requierd!", {status: 400})
         }
         if(!params.storeId){
            return new NextResponse("Store id is requierd!", {status: 400})
         }

         const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId: userId
            },
            data:{
                name: name
            }
         })
         return NextResponse.json(store)

    }
    catch(error){
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}

const DELETE = async(req: Request, {params}: {params: {storeId: string}}) =>{
    try{
         const {userId} = auth()
         if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
         }
         if(!params.storeId){
            return new NextResponse("Store id is requierd!", {status: 400})
         }

         const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId: userId
            },
         })
         return NextResponse.json(store)

    }
    catch(error){
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}


export {PATCH, DELETE}