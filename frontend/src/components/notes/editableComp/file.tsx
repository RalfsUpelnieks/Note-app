import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import api from '../../../utils/api';

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

        const formdata = new FormData();
        formdata.append('id', props.blockId);
        formdata.append('file', file[0]);
        setMsg("Uploading...")

        api.postType("/api/Files/UploadFile", formdata, null).then(response => {
            if (response?.ok) {
                console.log("File uploded");
                setMsg("")
                props.onPropertyChange("filename", file[0].name);
            } else if (response?.status == 401) {
                LogOut();
            } else {
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
            } else {
                setMsg("Download failed")
            }
        });
    }

    function handleDelete() {
        api.delete(`/api/Files/DeleteFile/${props.blockId}`).then(response => {
            if (response?.ok) {
                console.log("File deleted");
                props.onPropertyChange("filename", "");
            } else if (response?.status == 401) {
                LogOut();
            } else if (response?.status === 404) {
                console.log("File not found");
                props.onPropertyChange("filename", "");
            } 
        });
    }
    
    return (
        <>
            {props.properties.filename ?
                <div className="flex cursor-pointer w-full">
                    <i className="fa fa-file mr-1 mt-1 text-xs text-neutral-700" onClick={downloadFile}></i>
                    <span className='w-full text-sm text-neutral-700' onClick={downloadFile}>{props.properties.filename}</span>
                    <button className='w-5 h-5 pt-0 text-xs my-auto bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded' onClick={handleDelete}><i className='fa fa-trash'></i></button>
                </div>
            :
                <div className="w-full">
                    <div className="flex w-full">
                        <input type="file" onChange={ (e) => {setFile(e.target.files)} } className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file: file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border-0"/>
                        
                        <button className='w-24 h-8 text-sm my-auto bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded' onClick={handleUpload}>Upload</button>
                    </div>
                    {msg && <span className='block w-36 mx-auto'>{msg}</span>}
                </div>
            }
        </>
    )
}

export default File;