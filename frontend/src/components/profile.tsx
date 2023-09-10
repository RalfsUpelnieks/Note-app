import React, { useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import styles from '../stylesheets/Profile.module.css'
import configData from '../config.json'
import User from '../interfaces/userInterface'

interface ProfileProps {
    user?: User
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

function Profile({user, setUser}: ProfileProps) {
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name);
    const [surname, setSurname] = useState(user?.surname);
    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.emailAddress);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [nameMsg, setNameMsg] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');


    async function ChangeName(Name: string, Surname: string, setNameMsg: React.Dispatch<React.SetStateAction<string>>){
        let bearer = 'Bearer ' + localStorage.getItem('token');

        await fetch('http://localhost:' + configData.APIPort + '/api/User/ChangeName', {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Name, Surname})
        })
        .then(response => {
            if (response.ok) {
                response.text().then(data => { 
                    console.log("Name Changed");
                    setUser({ ...user!, name: Name, surname: Surname })
                    setNameMsg(data);
                });
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                response.json().then(data => {
                    setNameMsg(data.error);
                });
            }
        })
    }

    async function ChangeUsername(Username: string, setUsernameMsg: React.Dispatch<React.SetStateAction<string>>){
        let bearer = 'Bearer ' + localStorage.getItem('token');

        await fetch('http://localhost:' + configData.APIPort + '/api/User/ChangeUsername', {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Username})
        })
        .then(response => {
            if (response.ok) {
                response.text().then(data => { 
                    console.log("Username Changed");
                    setUser({ ...user!, username: Username })
                    setUsernameMsg(data);
                });
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                response.json().then(data => {
                    setUsernameMsg(data.error);
                });
            }
        })
    }

    async function ChangeEmail(Email: string, setEmailMsg: React.Dispatch<React.SetStateAction<string>>){
        let bearer = 'Bearer ' + localStorage.getItem('token');

        await fetch('http://localhost:' + configData.APIPort + '/api/User/ChangeEmail', {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Email})
        })
        .then(response => {
            if (response.ok) {
                response.text().then(data => { 
                    console.log("Username Changed");
                    setUser({ ...user!, emailAddress: Email })
                    setEmailMsg(data);
                });
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                response.json().then(data => {
                    setEmailMsg(data.error);
                });
            }
        })
    }

    async function ChangePassword(currentPassword: string, newPassword: string, setPasswordMsg: React.Dispatch<React.SetStateAction<string>>){
        let bearer = 'Bearer ' + localStorage.getItem('token');

        await fetch('http://localhost:' + configData.APIPort + '/api/User/ChangePassword', {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({currentPassword, newPassword})
        })
        .then(response => {
            if (response.ok) {
                response.text().then(data => { 
                    console.log("Password Changed");
                    setPasswordMsg(data);
                });
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                response.json().then(data => {
                    setPasswordMsg(data.error);
                });
            }
        })
    }

    async function DeleteUser(){
        let bearer = 'Bearer ' + localStorage.getItem('token');
    
        await fetch('http://localhost:' + configData.APIPort + '/api/User/DeleteUser', {
            method: 'DELETE',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            localStorage.removeItem('token');
            navigate('/login');
        });
    }

    async function SaveName (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if(name != user?.name || surname != user?.surname){
            await ChangeName(name!, surname!, setNameMsg);
        } else {
            setNameMsg("No changes made");
        }
    }

    async function SaveUsername (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if (username != user?.username){
            await ChangeUsername(username!, setUsernameMsg);
        } else {
            setUsernameMsg("No changes made");
        }
    }

    async function SaveEmail (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        if (email != user?.emailAddress){
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
        setName(user?.name);
        setSurname(user?.surname);
        setUsername(user?.username);
        setEmail(user?.emailAddress);
    }, [user]);
    
    useEffect(() => {
        setNameMsg('');
    }, [name, surname]);

    useEffect(() => {
        setUsernameMsg('');
    }, [username]);

    useEffect(() => {
        setEmailMsg('');
    }, [email]);

    useEffect(() => {
        setPasswordMsg('');
    }, [currentPassword, newPassword]);

    return(
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <div className={styles.profile}> 
            <h2>Profile settings</h2>
            <form onSubmit={SaveName}> 
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required name="name"/>
                    </div> 
                    <div className={styles.inputGroup}>
                        <label>Surname</label>
                        <input type="text" value={surname} onChange={e => setSurname(e.target.value)} required name="surname"/>
                    </div>
                    <button className={styles.button} type="submit">Save</button>
                </div>
                <p className={nameMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{nameMsg}</p>
            </form>
                
            <form onSubmit={SaveUsername}>
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required name="username"/>    
                    </div>
                    <button className={styles.button} type="submit">Save</button>
                </div>
                <p className={usernameMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{usernameMsg}</p>
            </form> 
            <form onSubmit={SaveEmail}>
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required name="email"/>
                    </div>
                    <button className={styles.button} type="submit">Save</button>
                </div>
                <p className={emailMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{emailMsg}</p>
            </form>                    
            <form onSubmit={SavePassword}>
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Current Password</label>
                        <input type="password" onChange={e => setCurrentPassword(e.target.value)} required name="oldPassword"/>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>New password</label>
                        <input type="password" onChange={e => setNewPassword(e.target.value)} required name="newPassword"/>
                    </div>
                    <button className={styles.button} type="submit">Change</button>
                </div>
                <p className={passwordMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{passwordMsg}</p>
            </form>
            <button className={[styles.button, styles.deleteButton].join(" ")} onClick={DeleteUser}>Delete Profile</button>
        </div>
    )
}

export default Profile;