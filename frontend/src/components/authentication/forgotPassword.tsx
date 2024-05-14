import React, { useEffect, useState} from 'react';
import PopUp from '../shared/popup';
import api from '../../utils/api';
import ROUTES from '../../utils/routePaths';

function ForgotPassword() {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');

    async function forgotPassword() {
        api.post("/api/Auth/forgetPassword", JSON.stringify({email})).then(response => {
            setMsg('Please check your email')
        });
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        setButtonDisabled(true);
        await forgotPassword();
    }
    
    useEffect(() => {
        setMsg('');
        setButtonDisabled(false);
    }, [email]);

    return(
        <PopUp title='NoteBooks'>
            <form className='px-10 pb-8 pt-4 flex flex-col' onSubmit={handleSubmit}>
                <h2 className='font-medium text-neutral-600 my-0 tracking-wide'>Password reset</h2>
                <span className='text-sm font-medium text-neutral-600 my-0 tracking-wide'>Link for reseting the password will be sent to your account's email address.</span>
                <div className='group'>
                    <label className={`${msg ? 'text-green-700' : 'text-neutral-500 group-focus-within:text-blue-500'}`}>Email</label>
                    <input type='email' className={`block peer w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid ${msg ? 'border-green-700' : 'border-[#ced4da]  group-focus-within:border-blue-400'}  leading-normal focus:outline-none box-border rounded-sm`} onChange={e => setEmail(e.target.value)} required name='email'/>
                </div>                    
                <p className={msg ? 'text-green-700 m-0' : 'hidden'} aria-live='assertive'>{msg}</p>
                <button className='h-10 mt-4 font-Roboto text-base tracking-wide bg-blue-600 text-white enabled:hover:bg-blue-700 enabled:hover:cursor-pointer border-none rounded-sm disabled:opacity-50' disabled={buttonDisabled} type='submit'>Reset password</button>
                <a href={ROUTES.Login} className='no-underline hover:underline text-blue-700 opacity-80 text-sm'>Back to log in</a>
            </form>
        </PopUp>
    )
}

export default ForgotPassword;