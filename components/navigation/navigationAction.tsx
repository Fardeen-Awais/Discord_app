"use client"
// TODO: action-tooltip
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { ActionTooltip } from "./action-tooltip"
import { Separator } from "../ui/separator"
import { useModalStore } from "@/hook/use-modal-store"

const NavigationAction = () => {
  const {onOpen} = useModalStore()

  return (
    <div className="pt-3">
      <ActionTooltip side="right" align="center" label="Add A server">
    <div className="group">
        <Button onClick={()=>onOpen("createServer")} className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus className="group-hover:text-white transition text-emerald-500" size={40}/>
        </Button>
    </div>
    </ActionTooltip>
    </div>
  )
}

export default NavigationAction