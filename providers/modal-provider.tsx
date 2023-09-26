"use client"
import CreateServerModal from "@/components/modals/createServermodal"
import EditServerModal from "@/components/modals/edit-server-modal"
import InviteModal from "@/components/modals/invite-modal"
import { useEffect, useState } from "react"

const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) {
        return null
    }

    return (
        <>
            <InviteModal />
            <CreateServerModal />
            <EditServerModal/>
        </>
    )
}

export default ModelProvider