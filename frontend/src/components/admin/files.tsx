import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useConfirmation from '../../hooks/useConfirmation';
import { ConvertTime } from '../../utils/timeConverter';
import { FormatBytes } from '../../utils/formatBytes';

function Files() {
    const { LogOut } : any = useAuth()
    const { OpenDeletionConfirmation } : any = useConfirmation();

    const [fileData, setFileData] = useState<any>([]);

    useEffect(() => {
        api.get("/api/Files/GetAllFiles").then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    console.log("Get all file data from server");
                    setFileData(data);
                });
            } else if (response?.status === 401) {
                LogOut();
            }
        })
    }, []);

    async function deleteFile(id: string) {
        api.delete(`/api/Files/DeleteFile/${id}`).then(response => {
            if (response?.ok) {
                console.log("File deleted");
                setFileData((files) => files.filter(file => file.blockId !== id));
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    function handleFileDeletionCheck(file) {
        OpenDeletionConfirmation(() => deleteFile(file.blockId), `file with name "${file.filename}"`)
    }

    return (
        <div className="max-w-5xl w-full m-4">
            <p className="text-neutral-500 text-lg mb-0 bg-zinc-100 w-min px-2 border border-b-0 border-solid border-gray-200">Files</p>
            <table className="border-collapse w-full shadow-lg overflow-hidden border border-solid bg-white border-gray-200">
                <thead className="text-sm text-neutral-500 bg-zinc-100">
                    <tr className="text-left">
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Owner</th>
                        <th className="px-2 py-1">Created at</th>
                        <th className="px-2 py-1">Size</th>
                        <th className="px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {fileData.length !== 0 ?
                        fileData.map((File: { blockId: string, filename: string; ownersUsername: string; createdAt: string;  size: string; }) => {
                            return (
                                <tr key={File.blockId} className="border-0 group border-solid border-t border-gray-300 hover:bg-zinc-100 select-none">
                                    <td className="px-2 py-2">{File.filename}</td>
                                    <td className="px-2 py-2">{File.ownersUsername}</td>
                                    <td className="px-2 py-2">{ConvertTime(File.createdAt)}</td>
                                    <td className="px-2 py-2">{FormatBytes(File.size)}</td>
                                    <td className='text-center'>
                                        <button className='w-20 h-7 mr-2 font-Roboto font-semibold text-xs bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer border-none rounded' onClick={() => handleFileDeletionCheck(File)}>Delete file</button>
                                    </td>
                                </tr>
                            );
                        })
                        :
                        <tr className="border-0 border-solid border-t text-center border-gray-300">
                            <td colSpan={5} className="py-2 text-neutral-600">No files</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Files;