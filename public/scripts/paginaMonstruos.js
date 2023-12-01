import {crearTabla} from "./table.js";
import {getMonstruos, postMonstruo, updateMonstruo, deleteMonstruo, getMonstruo} from "./peticiones.js";
import {Monstruo} from "./monstruo.js";


const tipos = ["Esqueleto","Zombie","Vampiro","Fantasma","Bruja","Hombre Lobo"];
localStorage.setItem("tipos", JSON.stringify(tipos));

const URL = "http://localhost:3000/Monstruos";

//Referencia la table
const table = document.getElementById("tablaMonstruos");
//Referencia al loader
const loader = document.getElementById("loader");

const btnEliminar = document.getElementById("eliminar");
const btnCancelar = document.getElementById("cancelar");

///EVENTO CUANDO HACEN CLICK EN LA TABLE
//CAMBIARLO PARA GET UNMONSTRUO
table.addEventListener("click",(e)=>{
    if(e.target.matches("td")){
        const id = e.target.parentElement.dataset.id;
        const {txtId,txtNombre,txtAlias,slcTipo,rdoDefensa,rngMiedo} = form;

        document.getElementById("agregar").textContent = "Modificar";
        btnEliminar.classList.remove("oculto");
        btnCancelar.classList.remove("oculto");

        //Cuando filtro las tablas pierdo informacion que tiene que ir dentro del form para poder
        //modificar, de esta manera obtengo el monstruo con toda la informacion
        //el problema es que tiene un delay de 2 seg
        getMonstruo(URL,id)
        .then(data => {           
            txtId.value = data["id"];
            console.log(txtId.value);
            txtNombre.value =  data["nombre"];
            txtAlias.value = data["alias"];
            rngMiedo.value = data["miedo"];
            rdoDefensa.value = data["defensa"];
            slcTipo.value = data["tipo"];
        })
        .catch(error => console.error(error));
    }
})

//Cuando aprieto cancelar
btnCancelar.addEventListener("click",()=>{
    resetForm();
})

function resetForm(){
    form.reset();
    document.getElementById("agregar").textContent= "Agregar";
    btnEliminar.classList.add("oculto");
    btnCancelar.classList.add("oculto");
}

//BOTON eliminar
btnEliminar.addEventListener("click",()=>{
    const {txtId} = form;
    let id = parseInt(txtId.value);
    console.log(id);

    if (confirm('¿Esta seguro de borrar el monstruo?')) {

        deleteMonstruo(URL,id)
        .then(()=> console.log("Se elimino el monstruo"))
        .catch((error => console.error(error)));
        resetForm();
        actualizarTabla(URL);
        console.log('Se borro el monstruo');
    }else{
        console.log('Se cancelo el borrado');
    }
})

function verificarDatosFormulario(txtNombre,txtAlias,slcTipo,rdoDefensa,rngMiedo){
    let retorno = true;
    let stringAlert = "";
    const alert = document.getElementById("alertForm");
    if(txtNombre.value === ""){
        stringAlert += "El Nombre no puede estar vacio.<br>";
        retorno = false;
    }

    if(txtAlias.value === ""){
        stringAlert += "El Alias no puede estar vacio.<br>";
        retorno = false;
    }

    if(slcTipo.options[slcTipo.selectedIndex].value === ""){
        stringAlert += "El Tipo no puede estar vacio.<br>";
        retorno = false;
    }

    if(rdoDefensa.value === ""){
        stringAlert += "Es necesario que seleccione una defensa.<br>";
        retorno = false;
    }

    if(!Number.isInteger(parseInt(rngMiedo.value))){
        stringAlert += "Es necesario que ponga un rango de miedo.<br>";
        retorno = false;
    }

    if(!retorno){
        alert.innerHTML = stringAlert;
        alert.classList.remove("oculto");
    }
    return retorno;
}

//FORM
const form = document.forms[0];

//Evento para el alert
form.addEventListener("input",()=>{
    const alerta = document.getElementById("alertForm");
    if(!alerta.classList.contains("oculto")){
        alerta.classList.add("oculto");
    }
});

//Evento submit del form
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log("Enviando...");
    const {txtId,txtNombre,txtAlias,slcTipo,rdoDefensa,rngMiedo} = form;

    if(verificarDatosFormulario(txtNombre,txtAlias,slcTipo,rdoDefensa,rngMiedo)){

        let nombre = txtNombre.value;
        let tipo = slcTipo.options[slcTipo.selectedIndex].value;
        let alias = txtAlias.value;
        let defensa = rdoDefensa.value;
        let miedo = parseInt(rngMiedo.value);

        if(txtId.value === ""){
            let nuevoMonstruo = new Monstruo(0, nombre, tipo, alias, miedo, defensa);
            nuevoMonstruo = nuevoMonstruo.eliminarId();
    
            postMonstruo(URL,nuevoMonstruo)
            .then(()=>console.log("Se agrego el monstruo exitosamente"))
            .catch(error=>console.error(error));
    
            actualizarTabla(URL);
        }else{
            let id = parseInt(txtId.value);

            const nuevoMonstruo = new Monstruo(id, nombre, tipo, alias, miedo, defensa);
            resetForm();
    
            updateMonstruo(URL,nuevoMonstruo)
            .then(()=>console.log("Se Modifico exitosamente el monstruo"))
            .catch(error=>console.error(error));

            actualizarTabla(URL);
        }
    }
});

//Funcion para cargar el select
const select = document.getElementById("tipoSelector");

const tiposFiltros = ["Todos","Esqueleto","Zombie","Vampiro","Fantasma","Bruja","Hombre Lobo"];
const selectTipoFiltro = document.getElementById("tipoFiltro");
asignarDatosSelect(selectTipoFiltro,tiposFiltros);

asignarDatosSelect(select,tipos); 

function asignarDatosSelect(nodo, arrayTipos){
    arrayTipos.forEach(e => {
        const nodoOpcion = document.createElement("option");
        const texto = document.createTextNode(e); 
        nodoOpcion.appendChild(texto);
        nodo.appendChild(nodoOpcion);
    });
}

//Evento cuando se cambia un filtro ya sea el de tipo o filtro de tablas
document.getElementById("contenedor-filtros").addEventListener("change",()=>{
    actualizarTabla(URL);
});


//CUANDO SE ABRE LA PAGINA
mostrarLoader();
getMonstruos(URL)
.then(data => {
    console.log("Se entro a la pagina por primera vez");
    data.sort((a, b) => b.miedo - a.miedo);
    
    const filtroDatos = selectedFiltroTipo();
    let nuevaData = filtrarTablaPorTipo(data,filtroDatos);

    document.getElementById("promedioMiedo").value = promedioMiedo(nuevaData);

    const seccionFiltros = document.getElementById("filtros-tabla");
    const checkboxsFiltros = seccionFiltros.querySelectorAll('input[type="checkbox"]:checked');
    nuevaData = filtrarTablaPorColumnas(nuevaData,checkboxsFiltros);
    crearTabla(table,nuevaData);
})
.catch(error => {
    console.error(error);
}).finally(()=> esconderLoader());

//SI NECESITAMOS ACTUALIZAR LA PAGINA
function actualizarTabla(url){
    console.log("Entro actualizar tabla");
    mostrarLoader();
    getMonstruos(url)
    .then(data => {
        data.sort((a, b) => b.miedo - a.miedo);

        const filtroDatos = selectedFiltroTipo();
        let nuevaData = filtrarTablaPorTipo(data,filtroDatos); 

        document.getElementById("promedioMiedo").value = promedioMiedo(nuevaData);
        
        const seccionFiltros = document.getElementById("filtros-tabla");
        const checkboxsFiltros = seccionFiltros.querySelectorAll('input[type="checkbox"]:checked');
        nuevaData = filtrarTablaPorColumnas(nuevaData,checkboxsFiltros);
        removerTabla();
        crearTabla(table,nuevaData);
    })
    .catch(error => console.error(error))
    .finally(()=> esconderLoader());
}

function mostrarLoader(){
    loader.classList.remove("oculto");
    table.classList.add("oculto");
}

function esconderLoader(){
    table.classList.remove("oculto");
    loader.classList.add("oculto");
}

function selectedFiltroTipo(){
    return selectTipoFiltro.options[selectTipoFiltro.selectedIndex].value;
}

function filtrarTablaPorTipo(data, filtro){
    const nuevaData = data.filter(obj =>{
        if(obj.tipo == filtro || filtro == "Todos"){
            return true;
        }
    })
    return nuevaData;
}

function filtrarTablaPorColumnas(data, columnas){
    if(columnas == null) return null;
    const atributosColumnas = Array.from(columnas).map(check => check.value);
    //le pongo al array de atributos id, para que no me lo ignore al hacer el filtrado
    atributosColumnas.push("id");
    //localStorage.setItem("filtroColumnas",JSON.stringify(atributosColumnas));
    const nuevaData = data.map(obj => {
        const nuevoObj = {};
        atributosColumnas.forEach(atributo => {
            if (obj.hasOwnProperty(atributo)) {
                nuevoObj[atributo] = obj[atributo];
            }
        });
        return nuevoObj;
    });
    return nuevaData
}


//REHACER no elimino todos los nodos
function removerTabla(){
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    if (thead) {
        thead.removeChild(thead.firstChild);
    }
    if(table)
    {
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }
}

function promedioMiedo(data){
    if(!Array.isArray(data)) return "Sin valores";
    
    let suma = data.reduce(function(anterior,actual){
        return anterior + actual.miedo;
    },0);
    let promedio = parseFloat(suma / data.length);
    return promedio > 0 ? promedio : "Sin valores";
}

