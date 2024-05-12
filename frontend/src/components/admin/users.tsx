import { useState, useEffect } from 'react';
import AddUser from './addUser';
import User from '../../interfaces/userInterface'
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useConfirmation from '../../hooks/useConfirmation';

function Users() {
    const { LogOut } : any = useAuth()
    const { OpenDeletionConfirmation } : any = useConfirmation();

    const [users, setUsers] = useState<User[]>([]);
    const [addPanelOpen, setAddPanelOpen] = useState(false);

    useEffect(() => {
        async function updatePages() {
            api.get("/api/User/GetAllUsers").then(response => {
                if (response?.ok) {
                    response.json().then(data => { 
                        console.log("Get all users data from server");
                        setUsers(data);
                    });
                } else if (response?.status === 401) {
                    LogOut();
                }
            })
        };
        updatePages();
    }, []);

    function DeleteUserData(){
        console.log("Data deletion not implemented");
    }

    async function DeleteUser(id: string) {
        api.delete(`/api/User/DeleteUser/${id}`).then(response => {
            if (response?.ok) {
                console.log("User deleted");
                setUsers((users) => users.filter(element => element.id !== id));
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    async function ChangeRole(id: string, role: string) {
        var newRole: string;
        if(role || role == "1"){
            newRole = "0";
        } else {
            newRole = "1";
        }

        api.post(`/api/User/ChangeRole/${id}`, JSON.stringify(newRole)).then(response => {
            if (response?.ok) {
                console.log("Role changed");
                const index = users.map((u) => u.id).indexOf(id);
                const updatedUsers = [...users];
                updatedUsers[index] = {...updatedUsers[index], role: newRole};
                setUsers(updatedUsers);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    function handleUserDeletionCheck(user) {
        OpenDeletionConfirmation(() => DeleteUser(user.id), `user with username "${user.username}"`)
    }

    return (
        <div>
            {addPanelOpen &&
                <AddUser closePanel={() => setAddPanelOpen(false)} users={users}/>
            }
            <h2>Users</h2>
            <table className="border-collapse shadow-lg bg-white overflow-hidden">
                <thead className="text-sm bg-zi-100 uppercase">
                    <tr>
                        <th className="px-2 py-1">Username</th>
                        <th className="px-2 py-1">Email</th>
                        <th className="px-2 py-1">Full Name</th>
                        <th className="px-2 py-0 w-[4%]">Storage Used</th>
                        <th className="px-2 py-1">Admin</th>
                        <th className="px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((Object: { id: string; name: string; surname: string; username: string; emailAddress: string; role: string }) => {
                        return (
                            <tr className="border-0 border-solid border-t border-gray-300">
                                <td className="px-2 py-2">{Object.username}</td>
                                <td className="px-2 py-2">{Object.emailAddress}</td>
                                <td className="px-2 py-2">{Object.name} {Object.surname}</td>
                                <td className="text-center">N/A</td>
                                <td className="text-center">
                                    <input className="m-0" type="checkbox" onChange={() => ChangeRole(Object.id, Object.role)} checked={Object.role == "1"}/>
                                </td>
                                <td>
                                    <button className='mr-1 w-20 h-6 text-xs bg-blue-600 text-white hover:bg-blue-900 hover:cursor-pointer border-none rounded' onClick={DeleteUserData}>Delete Data</button>
                                    <button className='w-20 h-6 text-xs bg-red-600 text-white hover:bg-red-900 hover:cursor-pointer border-none rounded' onClick={() => handleUserDeletionCheck(Object)}>Delete User</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className='mt-2 w-20 h-8 font-semibold text-xs bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded' onClick={() => setAddPanelOpen(true)}>Add User</button>
        </div>
    );
}

export default Users;