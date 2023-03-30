import React, { useEffect, useState} from 'react';
import {Navigate } from 'react-router-dom';
import Styles from '../stylesheets/Login.module.css'
import configData from '../config.json'


async function loginUser(Email: string, Password: string){
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
        await loginUser(email, password);
    }
    
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  return(
    localStorage.getItem('token') ? <Navigate to="/"/> :
    <div className={Styles.wrapper}>
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <p className={errMsg ? Styles.errMsg : Styles.offscreen} aria-live="assertive">{errMsg}</p>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}