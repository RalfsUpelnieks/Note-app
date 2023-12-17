import configData from '../../config.json'
import { useState } from 'react';

function File(props: any){
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

        let bearer = 'Bearer ' + localStorage.getItem('token');

        fetch('http://localhost:' + configData.APIPort + `/api/Files/UploadFile`, {
            method: 'POST',
            headers: {
                'Authorization': bearer
            },
            body: formdata
        }).then(response => {
            if (response.ok) {
                console.log("File uploded");
                setMsg("Upload succesful")
                props.onPropertyChange("filename", file[0].name);
            } else {
                setMsg("Upload failed")
            }
        })
    }

    function downloadFile() {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        fetch('http://localhost:' + configData.APIPort + `/api/Files/DownloadFile/${props.blockId}`, {
            method: 'Get',
            headers: {
                'Authorization': bearer
            },
        }).then(response => { 
            return response.blob();
            }).then(function(blob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', props.properties.filename);
                link.click();
            });
    }

    function handleDelete() {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        fetch('http://localhost:' + configData.APIPort + `/api/Files/DeleteFile/${props.blockId}`, {
            method: 'POST',
            headers: {
                'Authorization': bearer
            }
        }).then(response => {
            if (response.ok) {
                console.log("File deleted");
                props.onPropertyChange("filename", "");
            }
        })
    }
    
    return (
        <>
            {props.properties.filename ?
                <div className="flex cursor-pointer w-full">
                    <i className="fa fa-file mr-1 mt-1 text-xs text-neutral-700" onClick={downloadFile}></i>
                    <span className='w-full text-sm text-neutral-700' onClick={downloadFile}>{props.properties.filename}</span>
                    <button className='' onClick={handleDelete}>Delete</button>
                </div>
            :
                <div className="w-full">
                    <div className="flex w-full">
                        <input type="file" onChange={ (e) => {setFile(e.target.files)} } className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file: file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-100 file:text-gray-700
                        hover:file:bg-gray-200 border-0
                        "/>
                        
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                    {msg && <span className='block w-36 mx-auto'>{msg}</span>}
                </div>
            }
        </>
        
        
    )
}

export default File;