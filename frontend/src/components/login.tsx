import React, { useEffect, useState} from 'react';
import { Navigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const { LogIn } : any = useAuth()

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        await LogIn(email, password, setErrMsg);
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    return(
        localStorage.getItem('token') ? <Navigate to="/"/> :
        <form className='relative my-32 mx-auto max-w-xs px-6 py-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.151)]' onSubmit={handleSubmit}>
            <h1 className='font-Helvetica text-[2.5rem] text-center mt-0 mb-4'>NoteBooks</h1>   
            <div className='mb-2'>
                <label>Email</label>
                <input type='text' className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' onChange={e => setEmail(e.target.value)} required name='username'/>
            </div>                    
            <div>
                <label>Password</label>
                <input type='password' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' onChange={e => setPassword(e.target.value)} required name='password'/>
            </div>
            <p className={errMsg ? 'text-red-600 m-0' : 'hidden'} aria-live='assertive'>{errMsg}</p>
            <button className='w-full h-10 mt-3 font-Roboto font-bold text-base bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded' type='submit'>Log In</button>
        </form>
    )
}

export default Login;