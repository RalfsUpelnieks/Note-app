import { useNavigate } from 'react-router-dom';

function Header({isAdmin} : any) {
    const navigate = useNavigate();

    function logOutUser(){
        localStorage.removeItem('token');
        navigate("/login")
    }
    
    return (
        <header className='flex fixed left-0 right-0 top-0 bottom-auto px-4 justify-between z-10 items-center bg-[rgb(233,233,233)] shadow-[0px_3px_5px_-1px_rgba(0,0,0,0.2),_0px_1px_14px_0px_rgba(0,0,0,0.12)]'>
            <h1 className='text-3xl my-3'>SwiftNotes</h1>
            {isAdmin ? <h4 className='self-end ml-2 mr-auto mb-4 opacity-70'>admin page</h4>: null}
            {!isAdmin ? <input className='w-2/6 mx-3 lg:ml-[12%] ' type="text" placeholder="Search..."/> : null}
            <button onClick={logOutUser} className='w-24 h-9 font-semibold text-sm bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded '>Log out</button>
        </header>
    )
}

export default Header;