import React, { useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import styles from '../stylesheets/Login.module.css'
import configData from '../config.json'
import { isatty } from 'tty';

function AddUser({setTabOpen}: any) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    async function registerUser(Name: string, Surname: string, Username: string, Email: string, Password: string, IsAdmin: boolean, setErrMsg: React.Dispatch<React.SetStateAction<string>>){
        await fetch('http://localhost:' + configData.APIPort + '/api/Auth/register', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Name, Surname, Username, Email, Password, IsAdmin})
        })
        .then(response => {
            if (response.ok) {
                response.json().then(data => { 
                    console.log("User added");
                    console.log(data);
                    setTabOpen(false);
                });
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                response.json().then(data => {
                    setErrMsg(data.error);
                    console.log(data.error);
                    console.log(data);
                });
            }
        })
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault(); 
        await registerUser(name, surname, username, email, password, isAdmin, setErrMsg);
    }
    
    useEffect(() => {
        setErrMsg('');
    }, [name, surname, username, email, password, isAdmin]);

    return(
        <div className={styles.overlay}>
            <form className={styles.popup} onSubmit={handleSubmit}>
                <div className={styles.firstRow}>
                    <h2>Add user</h2>
                    <i className="fa fa-times" onClick={() => setTabOpen(false)}></i>
                </div>
                <div className={styles.name}>
                    <div>
                        <label>Name</label>
                        <input type="text" onChange={e => setName(e.target.value)} required name="text"/>
                    </div> 
                    <div>
                        <label>Surname</label>
                        <input type="text" onChange={e => setSurname(e.target.value)} required name="text"/>
                    </div> 
                </div>
                <div className={styles.formGroup}>
                    <label>Username</label>
                    <input type="username" onChange={e => setUsername(e.target.value)} required name="username"/>
                </div> 
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="username" onChange={e => setEmail(e.target.value)} required name="username"/>
                </div>                    
                <div className={styles.formGroup}>
                    <label>Password</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} required name="password"/>
                </div>
                <div className={styles.isAdmin}>
                    <input type="checkbox" onChange={e => setIsAdmin(e.target.checked)}/>
                    <label>Admin</label>
                </div>
                <div className={styles.formGroup}>
                    <p className={errMsg ? styles.errMessage : styles.offscreen} aria-live="assertive">{errMsg}</p>
                </div>
                <button className={styles.loginButton} type="submit">Add user</button>
            </form>
        </div>
    )
}

export default AddUser;