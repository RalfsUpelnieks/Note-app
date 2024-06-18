import { GetStoredAuthToken } from './authToken';

function Fetch(method, url) { 
    let bearer = 'Bearer ' + GetStoredAuthToken();

    return fetch(process.env.REACT_APP_API_HOST + url, {
        method: method,
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
    }}).then(response => {
        return response;
    }).catch(error => {
        console.error(error);
    });
}

function FetchWithBody(method, url, body, contentType = 'application/json') { 
    let bearer = 'Bearer ' + GetStoredAuthToken();

    return fetch(process.env.REACT_APP_API_HOST + url, {
        method: method,
        headers: {
            'Authorization': bearer,
            ...(contentType && {'Content-Type': contentType}),
        },
        body: body
    }).then(response => {
        return response;
    }).catch(error => {
        console.error(error);
    });
}

export default {
    get: (url) => Fetch('GET', url),
    post: (url, body) => FetchWithBody('POST', url, body),
    postType: (url, body, type) => FetchWithBody('POST', url, body, type),
    put: (url, body) => FetchWithBody('PUT', url, body),
    patch: (url, body) => FetchWithBody('PATCH', url, body),
    delete: (url) => Fetch('DELETE', url)
};