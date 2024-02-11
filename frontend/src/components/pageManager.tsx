import React, { useState}  from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import NotePage from './notePage';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

function PageManager() {
    const { LogOut } : any = useAuth()
    const params = useParams();
    const [blocks, setBlocks] = useState([]);
    const [pages, setPages] : any = useOutletContext();

    React.useEffect(() => {
        api.get(`/api/Note/GetBlockData/${params.id}`).then(response => {
            if (response?.ok) {
                response.json().then(data => { 
                    console.log("Get block data from server");
                    data.forEach(element => element.properties = JSON.parse(element.properties));
                    setBlocks(data);
                });
            } else if (response?.status === 401) {
                LogOut();
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