//Fetch Get Monstruos para index.html
export function getFetchMonstruos(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Error ${res.status}: ${res.statusText}`);
                reject(res);
            }
            const data = await res.json();
            resolve(data);
        } catch (error) {
            console.error(`Error: ${error}`);
            reject(error);
        }
    });
}

//Get Ajax Monstruos para monstruos.html
export function getMonstruos(url){
    return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState == 4){
                    if(xhr.status >= 200 && xhr.status < 300)
                    {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                    else{
                        reject(`ERROR ${xhr.status}: ${xhr.statusText}`);
                    }
                }
        }
        xhr.open("GET", url, true);
        try{                    
            xhr.send();        
        }
        catch(error){
            console.log(error);
        }
    });
}

//axios get un monstruo para monstruos.hmtl
export function getMonstruo(url,id) {
    return new Promise((resolve, reject) => {
        axios.get(url + "/" + id)
            .then(({ data }) => {
                resolve(data);
            })
            .catch(({ message }) => {
                console.error(message);
                reject(message);
            });
    });
}

//Post Ajax Monstruo para monstruos.html
export function postMonstruo(url,nuevoMonstruo) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    console.error(`ERROR ${xhr.status}: ${xhr.statusText}`);
                    reject({ status: xhr.status, statusText: xhr.statusText });
                }
            }
        };
        xhr.open("POST",url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        try {
            xhr.send(JSON.stringify(nuevoMonstruo));
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//Put con Fetch para monstruos.html
export function updateMonstruo(url,objeto) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(url + "/" + objeto.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(objeto),
            });
            if (!res.ok) {
                throw res;
            }
            const data = await res.json();
            console.log(data);
            resolve(data);
        }
        catch (res) {
            console.error(`Error ${res.status}: ${res.statusText}`);
            reject(res);
        }
    });
}

//Delete axios para monstruos.html
export function deleteMonstruo(url, id) {
    return new Promise((resolve, reject) => {
        axios.delete(url + "/" + id)
            .then(({ data }) => {
                resolve(data);
            })
            .catch(({ message }) => {
                console.error(message);
                reject(message);
            });
    });
}