"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal"

export const StoreModal = () => {
    const storeModal = useStoreModal()
    return (
        < Modal
            title="Stwórz nowy sklep"
            description="Stwórz nowy e-sklep dla twojego biznesu"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}>
            Future Create store form
        </Modal >
    )
}