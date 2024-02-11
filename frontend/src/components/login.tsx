import React, { useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';
import styles from '../stylesheets/Login.module.css'
import useAuth from '../hooks/useAuth';

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
        localStorage.getItem('token') ? <Navigate to="/"/> :
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>NoteBooks</h1>   
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