const srcIcons = ["../assets/icons/nombre.svg","../assets/icons/tipo.svg","../assets/icons/alias.svg","../assets/icons/miedo.svg","../assets/icons/defensa.svg"];

export function crearCards(container,data){
    if(!Array.isArray(data))return null;
    data.forEach(element => {
        const divCard = document.createElement("div");
        const divCardBody = document.createElement("div")
        const cardh5 = document.createElement("h5");
        divCard.classList.add("card");
        divCardBody.classList.add("card-body");

        cardh5.classList.add("card-title");
        cardh5.textContent = "MONSTRUO";
        divCardBody.appendChild(cardh5);

        divCard.appendChild(llenarCards(divCardBody,element));
        container.appendChild(divCard);
    });
}

function llenarCards(cardBody,data){
    let contador = 0;

    for (const key in data) {
        if(key == "id") continue;
        const cardBodyP = document.createElement("p");
        cardBodyP.classList.add("card-text");
        //al intentar crear un nodo img y appendearlo al nodo cardBodyP, que a su vez al final del mismo
        //se agregaba texto me borraba todo el nodo img, asi que decidi hacerlo de esta manera
        cardBodyP.innerHTML = `<img src='${srcIcons[contador]}' class='icono'></img>${key.toUpperCase()}: ${data[key]}`;
        cardBody.appendChild(cardBodyP);
        contador++;
    }
    return cardBody;
}