export function crearTabla(tabla,data){
    if(!Array.isArray(data))return null;
    tabla.appendChild(crearCabecera(data[0]));
    tabla.appendChild(crearCuerpo(data));
}

function crearCabecera(elemento){
    const cabecera = document.createElement("thead");
    const trCabecera = document.createElement("tr");
    cabecera.classList.add("table-dark");
    for (const key in elemento){
        if(key === "id") continue;
        const thCabecera = document.createElement("th");
        thCabecera.textContent = key.toUpperCase();
        trCabecera.appendChild(thCabecera);
    }

    cabecera.appendChild(trCabecera);
    return cabecera;
}

function crearCuerpo(elemento){
    const cuerpo = document.createElement("tbody");

    elemento.forEach(element => {
        const tr = document.createElement("tr");
        for (const key in element) {
            if(key == "id"){
                tr.dataset.id = element[key];
            }else{
                const td = document.createElement("td");
                td.textContent= element[key];
                tr.appendChild(td);
            }
        }
        cuerpo.appendChild(tr);
    });

    return cuerpo;
}