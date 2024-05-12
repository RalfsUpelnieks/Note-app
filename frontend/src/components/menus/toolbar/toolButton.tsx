import { ReactNode } from "react"

interface toolButtonProps{
    action: () => void,
    active: boolean,
    icon: ReactNode
}

export default function ToolButton({action, active, icon}: toolButtonProps){
    return(
        <button type="button" className={`flex px-0 py-1 bg-transparent border-none ${active ? 'bg-zinc-200 text-blue-600  hover:bg-zinc-300' : 'hover:bg-zinc-200 text-zinc-500 '}`} onClick={action}>{icon}</button>
    )
}