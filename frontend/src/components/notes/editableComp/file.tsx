import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import api from '../../../utils/api';
import { IconDelete, IconDownload } from '../../../icons';

function File(props: any){
    const { LogOut } : any = useAuth()
    const [file, setFile]: any = useState(null);
    const [msg, setMsg] = useState("");

    function handleUpload() {
        if(!file) {
            console.log("No file selected")
            setMsg("No file selected");
            return;
        }

        if(file[0].size > 52428800)
        {
            setMsg("File is too big. The max file size is 50MB.");
            return;
        }

        const formdata = new FormData();
        formdata.append('id', props.blockId);
        formdata.append('file', file[0]);
        setMsg("Uploading...")

        api.postType("/api/Files/UploadFile", formdata, null).then(response => {
            if (response?.ok) {
                console.log("File uploded");
                setMsg("")
                props.onPropertyChange("filename", file[0].name, false);
            } else if (response?.status == 401) {
                LogOut();
            } else {
                console.log(response)
                setMsg("Upload failed")
            }
        });
    }

    function downloadFile() {
        api.get(`/api/Files/DownloadFile/${props.blockId}`).then(response => {
            if (response?.ok) {
                response?.blob().then(function(blob) { 
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', props.properties.filename);
                    link.click();
                });
            } else if (response?.status == 401) {
                LogOut();
            } else if (response?.status === 404) {
                setMsg("File not found")
                props.onPropertyChange("filename", "", false);
            } else {
                setMsg("Download failed")
            }
        });
    }

    function handleDelete() {
        api.delete(`/api/Files/DeleteUsersFile/${props.blockId}`).then(response => {
            if (response?.ok) {
                console.log("File deleted");
                props.onPropertyChange("filename", "", false);
            } else if (response?.status == 401) {
                LogOut();
            } else if (response?.status === 404 || response?.status === 400) {
                console.log("File not found");
                props.onPropertyChange("filename", "", false);
            }
        });

        setFile(null);
    }

    function onChange(e){
        setMsg("");
        setFile(e.target.files)
    }
    
    return (
        <>
            {props.properties.filename ?
                <div className="flex cursor-pointer w-full">
                    <IconDownload/>
                    <span className='w-full px-1 text-sm text-neutral-700' onClick={downloadFile}>{props.properties.filename}</span>
                    <button className='flex p-[0.1rem] text-xs my-auto bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer border-none rounded' onClick={handleDelete}><IconDelete width={18} height={18}/></button>
                </div>
            :
                <div className="w-full">
                    <div className="flex w-full items-center">
                        <input type="file" onChange={onChange} className="flex w-full text-sm text-zinc-500 border-0 file:mr-2 file:py-1 file:my-1 file:px-4 file:bg-gray-100 hover:file:bg-gray-200 file: file:text-sm file:border file:border-solid file:border-zinc-400 file:cursor-pointer file:text-zinc-500 "/>
                        {msg && <span className='flex mr-2 w-52 text-sm text-zinc-700 justify-end'>{msg}</span>}
                        <button className='w-24 h-8 text-sm my-auto bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded' onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            }
        </>
    )
}

export default File;