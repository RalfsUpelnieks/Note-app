import React, { useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import styles from '../stylesheets/Login.module.css'
import configData from '../config.json'

function Login({setUser}: any) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    async function loginUser(Username: string, Password: string, setErrMsg: React.Dispatch<React.SetStateAction<string>>){
        await fetch('http://localhost:' + configData.APIPort + '/api/Auth/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Username, Password})
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => { 
                localStorage.setItem('token', data.token);
                setUser({
                    role: data.role,
                    email: data.email,
                    username: data.username,
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

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        await loginUser(email, password, setErrMsg);
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    return(
        localStorage.getItem('token') ? <Navigate to="/"/> :
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Note App</h1>   
            <div className={styles.formGroup}>
                <label>Email</label>
                <input type="text" onChange={e => setEmail(e.target.value)} required name="username"/>
            </div>                    
            <div className={styles.formGroup}>
                <label>Password</label>
                <input type="password" onChange={e => setPassword(e.target.value)} required name="password"/>
            </div>
            <div className={styles.formGroup}>
                <p className={errMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{errMsg}</p>
            </div>
            <button className={styles.loginButton} type="submit">Log In</button>
        </form>
    )
}

export default Login;