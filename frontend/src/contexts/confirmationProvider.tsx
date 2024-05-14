import { createContext, useState } from "react";

import ConfirmModal from "../components/shared/confirmModal";

const ConfirmationContext = createContext({});

export const ConfirmationProvider = ({ children }) => {
    const [confirmDeletion, setConfirmDeletion] = useState<any>({
        isOpen: false,
        action: null,
        actionName: '',
        title: '',
        description: ''
    });

    function OpenDeletionConfirmation(action: Promise<void>, name: string){
        setConfirmDeletion({
            isOpen: true,
            action: action,
            actionName: 'Delete',
            title: `Are you sure you want to delete ${name}?`,
            description: 'This item will be permanently deleted. This action is not reversible.'
        })
    }

    function OpenConfirmation(title: string, description: string, actionName: string, action: Promise<void>){
        setConfirmDeletion({
            isOpen: true,
            action: action,
            actionName: actionName,
            title: title,
            description: description
        })
    }
    
    return (
        <ConfirmationContext.Provider value={{ OpenDeletionConfirmation, OpenConfirmation, confirmDeletion }}>
            { children }
            { confirmDeletion.isOpen && 
                <ConfirmModal closePanel={() => setConfirmDeletion({ ...confirmDeletion, isOpen: false })} action={confirmDeletion.action} actionName={confirmDeletion.actionName} title={confirmDeletion.title} description={confirmDeletion.description}/> 
            }
        </ConfirmationContext.Provider>
    )
}

export default ConfirmationContext;