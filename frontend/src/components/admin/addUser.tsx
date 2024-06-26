import React, { useEffect, useState} from 'react';
import User from '../../interfaces/userInterface'
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import PopUp from '../shared/popup';
import { IconClose } from '../../icons';

interface AddUserProps {
    closePanel(): void
    users: User[]
}

function AddUser({closePanel, users}: AddUserProps) {
    const { LogOut } : any = useAuth()
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    async function addUser(Name: string, Surname: string, Username: string, Email: string, Password: string, IsAdmin: boolean, setErrMsg: React.Dispatch<React.SetStateAction<string>>) {
        api.post("/api/Auth/addUser", JSON.stringify({Name, Surname, Username, Email, Password, IsAdmin})).then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    console.log("User added");
                    users.push(data);
                    closePanel();
                });
            } else if (response?.status == 401) {
                LogOut();
            } else {
                response?.json().then(data => {
                    setErrMsg(data.error);
                });
            }
        });
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        await addUser(name, surname, username, email, password, isAdmin, setErrMsg);
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [name, surname, username, email, password, isAdmin]);

    useEffect(() => {
        document.addEventListener('click', clickOnBlurhandler);
        return () => {
            document.removeEventListener('click', clickOnBlurhandler);
        };
    }, []);

    function clickOnBlurhandler(e) {
        if(e.target.id === "blur") {
            closePanel();
        }
    };

    return(
        <div id='blur' className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-[rgba(0,0,0,0.7)]'>
            <PopUp title='Add User' navChildren={<div onClick={closePanel} className='flex text-neutral-700 items-center hover:cursor-pointer'><IconClose/></div>}>
                <form className='px-6 pt-4 pb-4 mx-auto ' onSubmit={handleSubmit}>
                    <div className='flex justify-between mb-4'>
                        <div className='w-[48%]'>
                            <label>Name</label>
                            <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" onChange={e => setName(e.target.value)} required name="text"/>
                        </div> 
                        <div className='w-[48%]'>
                            <label>Surname</label>
                            <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" onChange={e => setSurname(e.target.value)} required name="text"/>
                        </div> 
                    </div>
                    <div className='mb-3'>
                        <label>Username</label>
                        <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="username" onChange={e => setUsername(e.target.value)} required name="username"/>
                    </div> 
                    <div className='mb-3'>
                        <label>Email</label>
                        <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="email" onChange={e => setEmail(e.target.value)} required name="username"/>
                    </div>                    
                    <div className='mb-3'>
                        <label>Password</label>
                        <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="password" onChange={e => setPassword(e.target.value)} required name="password"/>
                    </div>
                    <div>
                        <input className='h-4 w-4 ml-0 mr-1' type="checkbox" onChange={e => setIsAdmin(e.target.checked)}/>
                        <label>Admin</label>
                    </div>
                    <p className={errMsg ? 'text-red-600 m-0' : 'hidden'} aria-live="assertive">{errMsg}</p>
                    <button className='w-full h-10 mt-2 font-Roboto font-bold text-base bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded' type="submit">Add user</button>
                </form>
            </PopUp>
        </div>
    )
}

export default AddUser;