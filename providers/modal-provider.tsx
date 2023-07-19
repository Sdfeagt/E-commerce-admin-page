"use client";
import { useEffect, useState } from "react"

import { StoreModal } from "@/components/ui/modals/store-model";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}