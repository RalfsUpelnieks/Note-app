import React, { useState}  from 'react';
import { useParams, useOutletContext, useNavigate, Navigate } from 'react-router-dom';
import NotePage from './notePage';
import NoPages from './NoPages';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

function PageManager() {
    const navigate = useNavigate();
    const { LogOut } : any = useAuth();
    const params = useParams();
    const [blocks, setBlocks] = useState([]);
    const [pages, setPages] : any = useOutletContext();

    React.useEffect(() => {
        if(params.id !== undefined){
            api.get(`/api/Note/GetBlockData/${params.id}`).then(response => {
                if (response?.ok) {
                    response.json().then(data => { 
                        console.log("Get block data from server");
                        data.forEach(element => element.properties = JSON.parse(element.properties));
                        setBlocks(data);
                    });
                } else if (response?.status === 401) {
                    LogOut();
                } else {
                    navigate("/");
                }
            })
        }
    }, [params.id]);

    if(pages.length === 0){
        return <NoPages />
    } else if(params.id === undefined) {
        return <Navigate to={`/page/${pages[0].pageId}`} />
    }
    else {
        return <NotePage pageId={params.id} blocks={blocks} setBlocks={setBlocks} />;
    }
}

export default PageManager