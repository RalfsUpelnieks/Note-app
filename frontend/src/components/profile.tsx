import React, { useEffect, useState} from 'react';
import styles from '../stylesheets/Profile.module.css'
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

function Profile() {
    const { auth, setAuth, LogOut } : any = useAuth()

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