import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../stylesheets/Table.module.css';
import configData from '../config.json'
import AddUser from './addUser';

function Users() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [addPanelOpen, setAddPanelOpen] = useState(false);

    useEffect(() => {
        async function updatePages() {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/User/GetAllUsers', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
            }}).then(response => {
                if (response.ok) {
                    response.json().then(data => { 
                        console.log("Get all users data from server");
                        setUsers(data);
                    });
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updatePages();
    }, []);

    function deleteUser(){
        console.log("Delete user");
    }

    return (
        !localStorage.getItem('token') ? <Navigate to="/"/> :<div>
            {addPanelOpen && (
                <AddUser setTabOpen={setAddPanelOpen}/>
            )}
            <h2>Users</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.column1}>Username</th>
                        <th className={styles.column2}>Email</th>
                        <th className={styles.column3}>Full Name</th>
                        <th className={styles.column4}>Storage Used</th>
                        <th className={styles.column5}>Admin</th>
                        <th className={styles.column6}></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((Object: { name: string; surname: string; username: string; emailAddress: string; role: any }) => {
                        // var isSelected = Object.pageId == openTab;
                        return (
                            <tr>
                                <td>{Object.username}</td>
                                <td>{Object.emailAddress}</td>
                                <td>{Object.name} {Object.surname}</td>
                                <td>N/A</td>
                                <td>
                                    <input type="checkbox" checked={Object.role == "1"}/>
                                </td>
                                <td>
                                <button onClick={deleteUser}>Delete Data</button>
                                <button onClick={deleteUser}>Delete User</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button onClick={() => setAddPanelOpen(!addPanelOpen)}>Add User</button>
        </div>
    );
}

export default Users;