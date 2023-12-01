import {getFetchMonstruos} from "./peticiones.js";
import {crearCards} from "./card.js";

const URL = "http://localhost:3000/Monstruos";
const container = document.getElementById("cartasMonstruos");
const loader = document.getElementById("loader");

loader.classList.remove("oculto");

getFetchMonstruos(URL)
.then(data => {
    loader.classList.add("oculto");
    crearCards(container,data);
}).catch(error=> console.error(error));

