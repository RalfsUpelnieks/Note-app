import React, { useState } from 'react';
import Styles from '../stylesheets/Login.module.css'
import PropTypes from 'prop-types'
import configData from '../config.json'


async function loginUser(Email, Password){
    return fetch('http://localhost:' + configData.APIPort + '/api/Auth/login', {
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
          return response.json();
        } else {
          response.json().then(data => {
            console.log(data);
          });
          return null;
        }
    })
}

export default function Login({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault(); 
        const token = await loginUser(email, password);
        setToken(token);
    }

  return(
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
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
setToken: PropTypes.func.isRequired
};