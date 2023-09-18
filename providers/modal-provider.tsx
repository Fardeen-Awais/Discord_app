"use client"
import CreateServerModal from "@/components/modals/createServermodal"
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
            <CreateServerModal />
        </>
    )
}

export default ModelProvider