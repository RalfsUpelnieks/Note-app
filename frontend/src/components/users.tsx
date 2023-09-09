import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../stylesheets/Table.module.css';
import configData from '../config.json'
import AddUser from './addUser';

function Users() {
    const navigate = useNavigate()

    interface User {
        id: string;
        name: string;
        surname: string;
        username: string;
        emailAddress: string;
        role: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [addPanelOpen, setAddPanelOpen] = useState(false);

    useEffect(() => {
        async function updatePages() {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/User/GetAllUsers', {
                method: 'GET',
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

    function DeleteUserData(){
        console.log("Data deleted");
    }

    async function DeleteUser(id: string){
        let bearer = 'Bearer ' + localStorage.getItem('token');
    
        await fetch('http://localhost:' + configData.APIPort + '/api/User/DeleteUser/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                console.log("User deleted");
                setUsers((users) => users.filter(element => element.id !== id));
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    }

    async function ChangeRole(id: string, role: string){
        let bearer = 'Bearer ' + localStorage.getItem('token');
        if(role || role == "1"){
            var newRole = "0";
        } else {
            var newRole = "1";
        }

        await fetch('http://localhost:' + configData.APIPort + '/api/User/ChangeRole/' + id, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRole)
        })
        .then(response => {
            if (response.ok) {
                console.log("Role changed");
                const index = users.map((u) => u.id).indexOf(id);
                const updatedUsers = [...users];
                updatedUsers[index] = {...updatedUsers[index], role: newRole};
                setUsers(updatedUsers);
            } else if (response.status == 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    }

    return (
        !localStorage.getItem('token') ? <Navigate to="/"/> :<div>
            {addPanelOpen && (
                <AddUser setTabOpen={setAddPanelOpen} users={users}/>
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
                    {users.map((Object: { id: string; name: string; surname: string; username: string; emailAddress: string; role: string }) => {
                        return (
                            <tr>
                                <td>{Object.username}</td>
                                <td>{Object.emailAddress}</td>
                                <td>{Object.name} {Object.surname}</td>
                                <td>N/A</td>
                                <td>
                                    <input type="checkbox" onChange={() => ChangeRole(Object.id, Object.role)} checked={Object.role == "1"}/>
                                </td>
                                <td>
                                <button onClick={DeleteUserData}>Delete Data</button>
                                <button onClick={() => DeleteUser(Object.id)}>Delete User</button>
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