import { useState, useEffect } from 'react';
import AddUser from './addUser';
import User from '../../interfaces/userInterface'
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useConfirmation from '../../hooks/useConfirmation';
import { ConvertTime } from '../../utils/timeConverter';

function Users() {
    const { LogOut, auth } : any = useAuth()
    const { OpenDeletionConfirmation, OpenConfirmation } : any = useConfirmation();

    const [users, setUsers] = useState<User[]>([]);
    const [addPanelOpen, setAddPanelOpen] = useState(false);

    useEffect(() => {
        UpdateCurrentUsers();
    }, []);

    async function UpdateCurrentUsers() {
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

    function DeleteUserData(id: string){
        api.delete(`/api/User/DeleteUserNotes/${id}`).then(response => {
            if (response?.ok) {
                console.log("User notes deleted");
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    async function ChangeRole(id: string, role: string) {
        api.post(`/api/User/ChangeRole/${id}`, JSON.stringify(role)).then(response => {
            if (response?.ok) {
                console.log("Role changed");
                const index = users.map((u) => u.id).indexOf(id);
                const updatedUsers = [...users];
                updatedUsers[index] = {...updatedUsers[index], role: role};
                setUsers(updatedUsers);

                if(auth.user.id == id) {
                    LogOut()
                }
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    function handleUserDeletionCheck(user) {
        OpenDeletionConfirmation(() => DeleteUser(user.id), `user with username "${user.username}"`)
    }

    function handleDataDeletionCheck(user) {
        OpenDeletionConfirmation(() => DeleteUserData(user.id), `"${user.username}" note data`)
    }

    function handleChangeRoleCheck(user) {
        if(user.role == "0"){
            OpenConfirmation(
                `Are you sure you want to make user "${user.username}" an administrator.`,
                "All user notes and files will be deleted. User will have full administration tools access. Double check if you want to do this.",
                "Accept",
                () => ChangeRole(user.id,  "1")
            );
        } else {
            OpenConfirmation(
                `Are you sure you want to remove user "${user.username}" administrator privileges.`,
                "User won't be able to access the administrator tools and will be given user privileges.",
                "Accept",
                () => ChangeRole(user.id,  "0")
            );
        }
    }

    return (
        <div className="max-w-5xl w-full m-4">
            {addPanelOpen &&
                <AddUser closePanel={() => setAddPanelOpen(false)} users={users}/>
            }
            <div className='w-full'>
                <p className="text-neutral-500 text-lg mb-0 bg-zinc-100 w-min px-2 border border-b-0 border-solid border-gray-200">Users</p>
                <table className="border-collapse w-full shadow-lg overflow-hidden border border-solid bg-white border-gray-200">
                    <thead className="text-sm text-neutral-500 bg-zinc-100">
                        <tr className="text-left">
                            <th className="px-2 py-1">Username</th>
                            <th className="px-2 py-1">Email</th>
                            <th className="px-2 py-1">Full Name</th>
                            <th className="px-2 py-1">Registered</th>
                            <th className="px-2 py-1">Last login</th>
                            <th className="px-2 py-1 text-center">Admin</th>
                            <th className="px-2 py-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((User: { id: string; name: string; surname: string; username: string; emailAddress: string; lastLoginAt: string; registeredAt: string;  role: string }) => {
                            return (
                                <tr key={User.id} className="border-0 group border-solid border-t border-gray-300 hover:bg-zinc-100 select-none">
                                    <td className="px-2 py-2">{User.username}</td>
                                    <td className="px-2 py-2">{User.emailAddress}</td>
                                    <td className="px-2 py-2">{User.name} {User.surname}</td>
                                    <td className="px-2 py-2">{ConvertTime(User.registeredAt)}</td>
                                    <td className="px-2 py-2">{ConvertTime(User.lastLoginAt)}</td>
                                    <td className="text-center">
                                        <input className="m-0" type="checkbox" onChange={() => handleChangeRoleCheck(User)} checked={User.role == "1"}/>
                                    </td>
                                    <td>
                                        <div className='flex justify-end'>
                                            {User.role != "1" &&
                                                <button className='w-20 h-7 mr-2 font-Roboto font-semibold text-xs bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' onClick={() => handleDataDeletionCheck(User)}>Delete Data</button>
                                            }
                                            <button className='w-20 h-7 mr-2 font-Roboto font-semibold text-xs bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer border-none rounded' onClick={() => handleUserDeletionCheck(User)}>Delete User</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr onClick={() => setAddPanelOpen(true)} className="border-0 border-solid border-t text-center border-gray-300 hover:bg-zinc-100 hover:cursor-pointer">
                            <td colSpan={8} className="py-2 text-neutral-400 hover:text-neutral-600">Add a User</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;