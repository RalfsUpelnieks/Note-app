import React, { useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import styles from '../stylesheets/Layout.module.css'
import configData from '../config.json'

function Profile({setUser}: any) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    async function loginUser(Email: string, Password: string, setErrMsg: React.Dispatch<React.SetStateAction<string>>){
        await fetch('http://localhost:' + configData.APIPort + '/api/Auth/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Email, Password})
        })
        .then(response => {
            if (response.ok) {
            response.json().then(data => { 
                localStorage.setItem('token', data.token);
                setUser({
                    role: data.role,
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                });
                if(data.role == "1"){
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
                console.log(data);
            });
            } else {
                response.json().then(data => {
                    setErrMsg(data.error);
                    console.log(data);
                });
            }
        })
    }

    async function handleSubmit (event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        await loginUser(email, password, setErrMsg);
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    return(
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <div> 
            <h2>Profile settings</h2>
            <form className={styles.form} onSubmit={handleSubmit}>  
                <div className={styles.formGroup}>
                    <label>Name</label>
                    <input type="text" onChange={e => setEmail(e.target.value)} required/>
                </div>                    
                <div className={styles.formGroup}>
                    <label>Surname</label>
                    <input type="text" onChange={e => setPassword(e.target.value)} required/>
                </div>
                <button className={styles.loginButton} type="submit">Save</button>
            </form>
            <form className={styles.form} onSubmit={handleSubmit}> 
                <div className={styles.formGroup}>
                    <label>Username</label>
                    <input type="text" onChange={e => setEmail(e.target.value)} required name="username"/>
                </div>                    
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} required name="password"/>
                </div>
                <div className={styles.formGroup}>
                    <p className={errMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{errMsg}</p>
                </div>
                <button className={styles.loginButton} type="submit">Save</button>
            </form>
            <form className={styles.form} onSubmit={handleSubmit}>  
                <div className={styles.formGroup}>
                    <label>Old password</label>
                    <input type="text" onChange={e => setEmail(e.target.value)} required name="username"/>
                </div>                    
                <div className={styles.formGroup}>
                    <label>New password</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} required name="password"/>
                </div>
                <div className={styles.formGroup}>
                    <p className={errMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{errMsg}</p>
                </div>
                <button className={styles.loginButton} type="submit">Save</button>
            </form>
            
        </div>
    )
}

export default Profile;