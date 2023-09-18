import React, { useState}  from 'react';
import { useParams } from 'react-router-dom';
import EditablePage from './editablePage';
import configData from '../config.json'

function NotePage({pages, navigate}: any) {
    const params = useParams();
    const [blocks, setBlocks] = useState([]);

    React.useEffect(() => {
        async function updateBlocks() {
            let bearer = 'Bearer ' + localStorage.getItem('token');
    
            await fetch('http://localhost:' + configData.APIPort + `/api/Note/GetBlockData/${params.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => { 
                        console.log("Get block data from server");
                        data.forEach(element => element.properties = JSON.parse(element.properties));
                        setBlocks(data);
                    });
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updateBlocks();
    }, [params.id]);

    if(pages.length === 0){
        return (
            <div></div>
        );
    } else {
        return <EditablePage pageId={params.id} blocks={blocks} setBlocks={setBlocks} err={""} />;
    }
}

export default NotePage;