import React, { useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import styles from '../stylesheets/Login.module.css'
import configData from '../config.json'

function AddUser() {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Email, Password})
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Added new user");
            });
            } else {
                localStorage.removeItem('token');
                navigate('/login');
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
        <div className={styles.overlay}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Add user</h2>   
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
        </div>
    )
}

export default AddUser;