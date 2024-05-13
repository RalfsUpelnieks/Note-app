import React, { useEffect, useState} from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useConfirmation from '../../hooks/useConfirmation';
import PopUp from './popup';
import { IconClose } from '../../icons';

interface profileProps {
    closePanel(): void
}

function Profile({ closePanel }: profileProps) {
    const { auth, setAuth, LogOut } : any = useAuth()
    const { OpenDeletionConfirmation, confirmDeletion } : any = useConfirmation();

    const [name, setName] = useState(auth.user?.name);
    const [surname, setSurname] = useState(auth.user?.surname);
    const [username, setUsername] = useState(auth.user?.username);
    const [email, setEmail] = useState(auth.user?.emailAddress);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [nameMsg, setNameMsg] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');

    async function ChangeName(Name: string, Surname: string, setNameMsg: React.Dispatch<React.SetStateAction<string>>){
        api.post("/api/User/ChangeName", JSON.stringify({Name, Surname})).then(response => {
            if (response?.ok) {
                response?.text().then(data => { 
                    console.log("Name Changed");
                    setAuth({ ...auth, user: { ...auth.user, name: Name, surname: Surname }})
                    setNameMsg(data);
                });
            } else if (response?.status == 401) {
                LogOut();
            } else {
                response?.json().then(data => {
                    setNameMsg(data.error);
                });
            }
        });
    }

    async function ChangeUsername(Username: string, setUsernameMsg: React.Dispatch<React.SetStateAction<string>>){
        api.post("/api/User/ChangeUsername", JSON.stringify({Username})).then(response => {
            if (response?.ok) {
                response?.text().then(data => { 
                    console.log("Username Changed");
                    setAuth({ ...auth, user: { ...auth.user, username: Username }})
                    setUsernameMsg(data);
                });
            } else if (response?.status == 401) {
                LogOut();
            } else {
                response?.json().then(data => {
                    setUsernameMsg(data.error);
                });
            }
        });
    }

    async function ChangeEmail(Email: string, setEmailMsg: React.Dispatch<React.SetStateAction<string>>){
        api.post("/api/User/ChangeEmail", JSON.stringify({Email})).then(response => {
            if (response?.ok) {
                response.text().then(data => { 
                    console.log("Email Changed");
                    setAuth({ ...auth, user: { ...auth.user, emailAddress: Email }})
                    setEmailMsg(data);
                });
            } else if (response?.status == 401) {
                LogOut();
            } else {
                response?.json().then(data => {
                    setEmailMsg(data.error);
                });
            }
        });
    }

    async function ChangePassword(currentPassword: string, newPassword: string, setPasswordMsg: React.Dispatch<React.SetStateAction<string>>){

        api.post("/api/User/ChangePassword", JSON.stringify({currentPassword, newPassword})).then(response => {
            if (response?.ok) {
                response.text().then(data => { 
                    console.log("Password Changed");
                    setPasswordMsg(data);
                });
            } else if (response?.status == 401) {
                LogOut();
            } else {
                response?.json().then(data => {
                    setPasswordMsg(data.error);
                });
            }
        });
    }

    async function DeleteUser(){
        api.delete("/api/User/DeleteUser").then(() => {
            LogOut();
        });
    }

    async function SaveName (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if(name != auth.user?.name || surname != auth.user?.surname){
            await ChangeName(name!, surname!, setNameMsg);
        } else {
            setNameMsg("No changes made");
        }
    }

    async function SaveUsername (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if (username != auth.user?.username){
            await ChangeUsername(username!, setUsernameMsg);
        } else {
            setUsernameMsg("No changes made");
        }
    }

    async function SaveEmail (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if (email != auth.user?.emailAddress){
            await ChangeEmail(email!, setEmailMsg);
        } else {
            setEmailMsg("No changes made");
        }
    }

    async function SavePassword (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (newPassword == currentPassword){
            setPasswordMsg("Input a new password");
        } else {
            await ChangePassword(currentPassword, newPassword, setPasswordMsg);
        }
    }

    useEffect(() => {
        setName(auth.user?.name);
        setSurname(auth.user?.surname);
        setUsername(auth.user?.username);
        setEmail(auth.user?.emailAddress);
    }, [auth.user]);
    
    useEffect(() => {
        setNameMsg('');
    }, [name, surname, username, email, currentPassword, newPassword]);

    useEffect(() => {
        setUsernameMsg('');
    }, [username]);

    useEffect(() => {
        setEmailMsg('');
    }, [email]);

    useEffect(() => {
        setPasswordMsg('');
    }, [currentPassword, newPassword]);

    useEffect(() => {
        document.addEventListener('click', ClickOnBlurhandler);
        return () => {
            document.removeEventListener('click', ClickOnBlurhandler);
        };
    }, []);

    function ClickOnBlurhandler(e) {
        if(e.target.id === "profileBlur") {
            closePanel();
        }
    };

    return(
        (confirmDeletion.isOpen ?
            <></>
            :
            <div id='profileBlur' className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-[rgba(0,0,0,0.7)]'>
                <PopUp title='Profile settings' navChildren={<div onClick={closePanel} className='flex text-neutral-700 items-center hover:cursor-pointer'><IconClose/></div>}>
                    <div className='px-6 pt-4 pb-4 mx-auto rounded bg-white'>
                        <form onSubmit={SaveName} className='mb-4'> 
                            <div className='flex justify-between'>
                                <div className='mr-2'>
                                    <label>Name</label>
                                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" value={name} onChange={e => setName(e.target.value)} required name="name"/>
                                </div> 
                                <div className='mr-2'>
                                    <label>Surname</label>
                                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" value={surname} onChange={e => setSurname(e.target.value)} required name="surname"/>
                                </div>
                                <button className='w-20 h-[2.3rem] self-end font-Roboto font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' type="submit">Save</button>
                            </div>
                            <p className={nameMsg ? 'text-gray-500 m-0' : 'hidden'} aria-live="assertive">{nameMsg}</p>
                        </form>
                            
                        <form onSubmit={SaveUsername} className='mb-4'>
                            <div className='flex justify-between'>
                                <div className='mr-2 w-full'>
                                    <label>Username</label>
                                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" value={username} onChange={e => setUsername(e.target.value)} required name="username"/>    
                                </div>
                                <button className='w-20 h-[2.3rem] self-end font-Roboto font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' type="submit">Save</button>
                            </div>
                            <p className={usernameMsg ? 'text-gray-500 m-0' : 'hidden'} aria-live="assertive">{usernameMsg}</p>
                        </form> 
                        <form onSubmit={SaveEmail} className='mb-4'>
                            <div className='flex justify-between'>
                                <div className='mr-2 w-full'>
                                    <label>Email</label>
                                    <input type="email" className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' value={email} onChange={e => setEmail(e.target.value)} required name="email"/>
                                </div>
                                <button className='w-20 h-[2.3rem] self-end font-Roboto font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' type="submit">Save</button>
                            </div>
                            <p className={emailMsg ? 'text-gray-500 m-0' : 'hidden'} aria-live="assertive">{emailMsg}</p>
                        </form>                    
                        <form onSubmit={SavePassword} className='mb-4'>
                            <div className='flex justify-between'>
                                <div className='mr-2 w-full'>
                                    <label>Current Password</label>
                                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="password" onChange={e => setCurrentPassword(e.target.value)} required name="oldPassword"/>
                                </div>
                                <div className='mr-2 w-full'>
                                    <label>New password</label>
                                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="password" onChange={e => setNewPassword(e.target.value)} required name="newPassword"/>
                                </div>
                                <button className='w-48 h-[2.3rem] self-end font-Roboto font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' type="submit">Change</button>
                            </div>
                            <p className={passwordMsg ? 'text-gray-500 m-0' : 'hidden'} aria-live="assertive">{passwordMsg}</p>
                        </form>
                        <button className='w-28 h-[2.3rem] self-end font-Roboto font-medium text-sm bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer border-none rounded' onClick={() => OpenDeletionConfirmation(DeleteUser, 'this user')}>Delete Profile</button>
                    </div>
                </PopUp>
            </div>
        )
    )
}

export default Profile;