import React, { useEffect, useState} from 'react';
import useAuth from '../../hooks/useAuth';
import PopUp from '../shared/popup';
import LinkButton from './linkButton';

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
        <PopUp title='NoteBooks' navChildren={<LinkButton Text='Register' Link='/register'></LinkButton>}>
            <form className='px-10 pb-8 pt-7 flex flex-col' onSubmit={handleSubmit}>
                <span className='text-xl font-medium text-neutral-600 mb-4 mt-0 tracking-wide'>Log In</span>
                <div className='mb-3 group'>
                    <label className={`${errMsg ? 'text-pink-700' : 'text-neutral-500 group-focus-within:text-blue-500'}`}>Email or Username</label>
                    <input type='text' className={`block peer w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid ${errMsg ? 'border-pink-700' : 'border-[#ced4da]  group-focus-within:border-blue-400'}  leading-normal focus:outline-none box-border rounded-sm`} onChange={e => setEmail(e.target.value)} required name='username'/>
                </div>                    
                <div className='group'>
                    <label className={`${errMsg ? 'text-pink-700' : 'text-neutral-500 group-focus-within:text-blue-500'}`}>Password</label>
                    <input type='password' className={`block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid ${errMsg ? 'border-pink-700' : 'border-[#ced4da]  group-focus-within:border-blue-400'} leading-normal focus:outline-none box-border rounded-sm`} onChange={e => setPassword(e.target.value)} required name='password'/>
                </div>
                <p className={errMsg ? 'text-pink-700 m-0' : 'hidden'} aria-live='assertive'>{errMsg}</p>
                <a href="" className='no-underline hover:underline text-blue-700 opacity-80 text-sm'>Forgot password?</a>
                <button className='h-10 mt-6 font-Roboto text-base tracking-wide bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded-sm' type='submit'>Log In</button>
            </form>
        </PopUp>
    )
}

export default Login;