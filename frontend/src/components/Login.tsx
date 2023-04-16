import React, { useEffect, useState} from 'react';
import {Navigate } from 'react-router-dom';
import styles from '../stylesheets/Login.module.css'
import configData from '../config.json'


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
            window.location.reload();
          });
        } else {
          response.json().then(data => {
            setErrMsg(data.error);
            console.log(data);
          });
        }
    })
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        await loginUser(email, password, setErrMsg);
    }
    
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  return(
    localStorage.getItem('token') ? <Navigate to="/"/> :
    <div> 
      <form className={styles.form} id="submitForm" onSubmit={handleSubmit}>
        <h1 className={styles.title}>Note App</h1>   
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="text" className="form-control text-lowercase" id="username" onChange={e => setEmail(e.target.value)} required name="username"/>
        </div>                    
        <div className={styles.formGroup}>
          <label className="d-flex flex-row align-items-center">Password</label>
          <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} required id="password" name="password"/>
        </div>
        <div className={styles.formGroup}>
          <p className={errMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{errMsg}</p>
        </div>
        <div className="form-group pt-1">
          <button className={styles.loginButton} type="submit">Log In</button>
        </div>
      </form>
      {/* <p className="small-xl pt-3 text-center">
        <span className="text-muted">Not a member?</span>
        <a href="/signup">Sign up</a>
      </p> */}
    </div>)
}