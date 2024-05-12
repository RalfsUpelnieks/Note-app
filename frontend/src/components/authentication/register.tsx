import React, { useEffect, useState} from 'react';
import PopUp from '../shared/popup';
import LinkButton from './linkButton';
import api from '../../utils/api';
import useAuth from '../../hooks/useAuth';

function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const { LogIn } : any = useAuth()

    async function registerUser(Name: string, Surname: string, Username: string, Email: string, Password: string, setErrMsg: React.Dispatch<React.SetStateAction<string>>) {
        api.post("/api/Auth/register", JSON.stringify({Name, Surname, Username, Email, Password})).then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    console.log("User added");
                    LogIn(email, password, setErrMsg);
                });
            } else {
                response?.json().then(data => {
                    setErrMsg(data.error);
                });
            }
        });
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 

        if (password !== passwordConfirmation){
            setErrMsg("Passwords do not match");
        }
        else {
            await registerUser(name, surname, username, email, password, setErrMsg);
        }
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [name, surname, username, email, password, passwordConfirmation]);

    return(
        <PopUp title='NoteBooks' navChildren={<LinkButton Text='Log In' Link='/login'></LinkButton>}>
            <form className='px-10 pb-8 pt-7 flex flex-col' onSubmit={handleSubmit}>
                <span className='text-xl font-medium text-neutral-600 mb-4 mt-0 tracking-wide'>Register</span>

                <div className='flex justify-between mb-3'>
                    <div className='w-[48%] group'>
                        <label className='text-neutral-500 group-focus-within:text-blue-500'>Name</label>
                        <input type='text' className='block peer w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setName(e.target.value)} required name="text"/>
                    </div> 
                    <div className='w-[48%] group'>
                        <label className='text-neutral-500 group-focus-within:text-blue-500'>Surname</label>
                        <input type='text' className='block peer w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setSurname(e.target.value)} required name="text"/>
                    </div> 
                </div>
                <div className='group'>
                    <label className='text-neutral-500 group-focus-within:text-blue-500'>Username</label>
                    <input type='username' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setUsername(e.target.value)} required name='username'/>
                </div>
                <div className='group'>
                    <label className='text-neutral-500 group-focus-within:text-blue-500'>Email</label>
                    <input type='email' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setEmail(e.target.value)} required name='email'/>
                </div>
                <div className='group'>
                    <label className='text-neutral-500 group-focus-within:text-blue-500'>Password</label>
                    <input type='password' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setPassword(e.target.value)} required name='password'/>
                </div>
                <div className='group'>
                    <label className='text-neutral-500 group-focus-within:text-blue-500'>Confirm password</label>
                    <input type='password' className='block w-full mb-2 px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da]  group-focus-within:border-blue-400 leading-normal focus:outline-none box-border rounded-sm' onChange={e => setPasswordConfirmation(e.target.value)} required name='password'/>
                </div>
                <p className={errMsg ? 'text-pink-700 m-0' : 'hidden'} aria-live='assertive'>{errMsg}</p>
                <button className='h-10 mt-6 font-Roboto text-base tracking-wide bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded-sm' type='submit'>Sign Up</button>
            </form>
        </PopUp>
    )
}

export default Register;