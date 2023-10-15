"use client"
import { useEffect, useState } from "react"
import LeaveServerModal from "@/components/modals/LeaveSeverModal"
import CreateChannelModal from "@/components/modals/createChannelmodal"
import CreateServerModal from "@/components/modals/createServermodal"
import DeleteServerModal from "@/components/modals/deleteServerModal"
import EditServerModal from "@/components/modals/edit-server-modal"
import InviteModal from "@/components/modals/invite-modal"
import MemberModal from "@/components/modals/members-modal"
import DeleteChannelModal from "@/components/modals/deleteChannelModal"
import EditChannelModal from "@/components/modals/editChannelModal"


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
            <MemberModal/>
            <CreateChannelModal/>
            <LeaveServerModal/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannelModal/>
        </>
    )
}

export default ModelProvider