import React, { useState}  from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import NotePage from './notePage';
import configData from '../config.json'

function PageManager({pages}: any) {
    const params = useParams();
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState([]);

    React.useEffect(() => {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        fetch('http://localhost:' + configData.APIPort + `/api/Note/GetBlockData/${params.id}`, {
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
    }, [params.id]);

    if(pages.length === 0){
        return (
            <div></div>
        );
    } else {
        return <NotePage pageId={params.id} blocks={blocks} setBlocks={setBlocks} />;
    }
}

export default PageManager