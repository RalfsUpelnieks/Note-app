import { useState } from "react";
import Profile from '../shared/profile';
import useAuth from '../../hooks/useAuth';

interface HeaderProps{
    children : React.ReactNode
}

function Header({children} : HeaderProps) {
    const { auth, LogOut } : any = useAuth()
    const [profilePanelOpen, setProfilePanelOpen] = useState(false);

    function logOutUser(){
        LogOut();
    }
    
    return (
        <header className='flex select-none bottom-auto px-4 justify-between z-10 items-center bg-zinc-100 border-0 border-b border-solid border-gray-200'>
            {profilePanelOpen &&
                <Profile closePanel={() => setProfilePanelOpen(false)}/>
            }
            <h2 className='text-2xl font-medium text-neutral-500 my-2'>NoteBooks</h2>
            {children}
            <div className='flex items-center '>
                <button onClick={() => setProfilePanelOpen(!profilePanelOpen)} className='cursor-pointer mr-4 px-1 no-underline bg-transparent rounded border border-solid border-gray-200 hover:border-blue-400'>
                    <p className='m-0 text-[0.9rem] leading-4 font-sans font-semibold text-zinc-700 text-left'>{auth.user.name} {auth.user.surname}</p>
                    <p className='m-0 text-[0.8rem] text-neutral-500 text-left'>{auth.user.emailAddress}</p>
                </button>
                <button onClick={logOutUser} className='px-5 h-8 font-Roboto text-sm tracking-wide bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded'>Log out</button>
            </div>
        </header>
    )
}

export default Header;