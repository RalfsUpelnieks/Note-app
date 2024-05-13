import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import PopUp from '../shared/popup';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState({
        positive: false,
        message: ''
    });
    const [state, setState] = useState({
        loaded: false,
        validToken: null,
    });
    const { email, token } = useParams();

    useEffect(() => {
        api.post("/api/Auth/validateToken", JSON.stringify({email, token})).then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    setState({loaded: true, validToken: data})
                });
            }
        });
    }, [email, token]);

    async function resetPassword() {
        api.post("/api/Auth/resetPassword", JSON.stringify({email, token, password})).then(response => {
            if (response?.ok) {
                navigate("/login");
            } else if (response?.status == 401) {
                window.location.reload();
            }  else {
                response?.json().then(data => {
                    console.log(data)
                    setMessage({positive: false, message: data.error})
                });
            }
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(password == passwordConfirmation) {
            
            await resetPassword();
        }
        else {
            setMessage({positive: false, message: "Passwords don't match."})
        }
    }

    useEffect(() => {
        setMessage({ ...message, message: '' });
    }, [password, passwordConfirmation]);

    return(
        state.loaded ?
            state.validToken ?
                <PopUp title='NoteBooks'>
                    <form className='px-10 pb-8 pt-4 flex flex-col' onSubmit={handleSubmit}>
                        <h2 className='font-medium text-neutral-600 mt-0 tracking-wide'>Password reset</h2>
                        <div className='group'>
                            <label className='text-neutral-500 group-focus-within:text-blue-500'>Password</label>
                            <input type='password' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setPassword(e.target.value)} required name='password'/>
                        </div>
                        <div className='group'>
                            <label className='text-neutral-500 group-focus-within:text-blue-500'>Confirm password</label>
                            <input type='password' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setPasswordConfirmation(e.target.value)} required name='password'/>
                        </div>                
                        <p className={`m-0 ${message.message ? 'flex' : 'hidden'} ${message.positive ? 'text-green-700' : 'text-pink-700'}`} aria-live='assertive'>{message.message}</p>
                        <button className='h-10 mt-4 font-Roboto text-base tracking-wide bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded-sm disabled:opacity-50' type='submit'>Reset password</button>
                    </form>
                </PopUp>
                :
                <PopUp title='NoteBooks'>
                    <div className='px-10 pb-8 pt-4 flex flex-col'>
                        <h2 className='font-medium text-neutral-600 my-0 tracking-wide'>Invalid token</h2>
                        <span className='text-sm font-medium text-neutral-600 my-0 tracking-wide'>The reset password link is invalid. Request another link in the forget password page.</span>
                        <a href="/login" className='no-underline hover:underline text-blue-700 opacity-80 text-sm'>Back to log in</a>
                    </div>
                </PopUp>
            :
            <div>Please wait...</div>
        
    )
}

export default ResetPassword;