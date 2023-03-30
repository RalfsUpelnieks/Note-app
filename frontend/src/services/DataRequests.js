import configData from '../config.json'

class DataRequests {
    async requestFromAPI(url, method, body = null) {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        let headers = {
            'Authorization': bearer,
            'Content-Type': 'application/json',
        }

        await fetch('http://localhost:' + configData.APIPort + url, {
          method: method,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: headers,
          body: body
        })
        .then(response => {
            if (response.ok) {
              response.json().then(data => { 
                console.log(data);
                return data;
              });
            } else {
              response.json().then(data => {
                console.log(data);
              });
            }
        })
    }
}

export default new DataRequests();