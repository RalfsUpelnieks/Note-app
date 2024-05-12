import React from 'react';

interface PopUpProps {
    title: string;
    navChildren?: React.ReactNode;
    children: React.ReactNode;
}

function PopUp({title, navChildren, children} : PopUpProps) {
    return(
        <div className='relative border border-solid border-gray-300 bg-white my-32 mx-auto max-w-md drop-shadow-lg'>
            <div className='flex justify-between bg-zinc-100 border-0 border-b border-solid border-gray-200 ps-2'>
                <h1 className='text-xl font-medium text-neutral-500 my-0'>{title}</h1>
                {navChildren}
            </div>
            {children}
        </div>
    )
}

export default PopUp;