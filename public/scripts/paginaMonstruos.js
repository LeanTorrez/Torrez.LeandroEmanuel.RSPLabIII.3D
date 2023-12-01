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

//Referencia al button formulario eliminar
const btnEliminar = document.getElementById("eliminar");
//Referencia al button formulario cancelar
const btnCancelar = document.getElementById("cancelar");

///EVENTO CUANDO HACEN CLICK EN LA TABLE
//tarda en cargar la informacion 2 seg por delay
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

//Resetea el form y cambia los nombre de los botones, esconde cancelar y eliminar
function resetForm(){
    form.reset();
    document.getElementById("agregar").textContent= "Agregar";
    btnEliminar.classList.add("oculto");
    btnCancelar.classList.add("oculto");
}

//Evento boton eliminar
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

//Verifica los datos del form, y muestra un alert bootstrap en caso de que falte algo
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
        //escribo en inner htlm los mensajes warnings
        alert.innerHTML = stringAlert;
        alert.classList.remove("oculto");
    }
    return retorno;
}

//Referencia form
const form = document.forms[0];
//Evento para eliminar el alert cuando faltan campos en el form, cuando se ingresa algo se oculta el alert
form.addEventListener("input",()=>{
    const alerta = document.getElementById("alertForm");
    if(!alerta.classList.contains("oculto")){
        alerta.classList.add("oculto");
    }
});

//Evento submit del form para el post y put
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

//Referencia del select del form
const select = document.getElementById("tipoSelector");


//variables que son para el selectipoFiltro que fue cambiado por el dropdown de bootstrap
//const tiposFiltros = ["Todos","Esqueleto","Zombie","Vampiro","Fantasma","Bruja","Hombre Lobo"];
//const selectTipoFiltro = document.getElementById("tipoFiltro");
//asignarDatosSelect(selectTipoFiltro,tiposFiltros);

asignarDatosSelect(select,tipos); 

//asigna el array al nodo select con sus respectivos option
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

const orderMiedo = (a, b) => b.miedo - a.miedo;

//CUANDO SE ABRE LA PAGINA O SE ACTUALIZA
mostrarLoader();
getMonstruos(URL)
.then(data => {
    console.log("Se entro a la pagina por primera vez");
    data.sort(orderMiedo);
    
    /* const filtroDatos = selectedFiltroTipo();
    let nuevaData = filtrarTablaPorTipo(data,filtroDatos); */

    const filtroDatosDropdown = dropdownFiltroTipo();
    let nuevaData = filtrarTablaPorTipo(data,filtroDatosDropdown);

    document.getElementById("promedioMiedo").value = promedioMiedo(nuevaData);
    document.getElementById("maximoMiedo").value = maximoMiedo(nuevaData);
    document.getElementById("minimoMiedo").value = minimoMiedo(nuevaData);

    const seccionFiltros = document.getElementById("filtros-tabla").querySelectorAll('input[type="checkbox"]');
    checkboxPorLocalStorage(seccionFiltros);
    nuevaData = filtrarTablaPorLocalStorage(data);
    crearTabla(table,nuevaData);
})
.catch(error => {
    console.error(error);
}).finally(()=> esconderLoader());

//Funcion para actualizar la tabla cuando hacemos post, put, delete con su respectivo loader
function actualizarTabla(url){
    mostrarLoader();
    getMonstruos(url)
    .then(data => {
        data.sort(orderMiedo);

        /* const filtroDatos = selectedFiltroTipo();
        let nuevaData = filtrarTablaPorTipo(data,filtroDatos); */

        //obtengo el filtro del button dropdown y lo aplico
        const filtroDatosDropdown = dropdownFiltroTipo();
        let nuevaData = filtrarTablaPorTipo(data,filtroDatosDropdown);

        document.getElementById("promedioMiedo").value = promedioMiedo(nuevaData);
        document.getElementById("maximoMiedo").value = maximoMiedo(nuevaData);
        document.getElementById("minimoMiedo").value = minimoMiedo(nuevaData);
        
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
    //le pongo al array de atributos id, para que no me lo ignore al hacer el filtrado y para crear la tabla
    atributosColumnas.push("id");
    //guardo los datos actuales de los checkboxes en localstorage
    localStorage.setItem("filtroColumnas",JSON.stringify(atributosColumnas));
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


//REHACER no elimino todos los nodos que tienen los tr en tbody y thead
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

//Recuperatorio Segundo parcial

//Miedo maximo registrado en la tabla
function maximoMiedo(data){
    if(!Array.isArray(data)) return "Sin valores";
    
    let max = data.reduce(function(anterior,actual){
        return anterior > actual.miedo ? anterior : actual.miedo;
    },-1);
    return max > -1 ? max : "Sin valores" ;
}

//Miedo minimo registrado en la tabla
function minimoMiedo(data){
    if(!Array.isArray(data)) return "Sin valores";
    
    let min = data.reduce(function(anterior, actual){
        return anterior < actual.miedo ? anterior : actual.miedo;
    },101);
    return min < 101 ? min : "Sin valores";
}

//seteo los datos del localstorage en una variable, en caso de no existir este item en el local
//lo creo y lo guardo y lo envio como si estuvieran todos los filtros checkeados
function filtrosLocalStorage(){
    const columnas = [];
    if (localStorage.getItem("filtroColumnas")) {
      JSON.parse(localStorage.getItem("filtroColumnas")).forEach((element) => {
        columnas.push(element);
      });
    } else {
      localStorage.setItem("filtroColumnas", JSON.stringify(["nombre","alias","miedo","defensa","tipo","id"]));
      return ["nombre","alias","miedo","defensa","tipo","id"];
    }
    return columnas;
}

//cuando cargo la pagina tomo los valores que se guardaron el localstorage con anterioridad
function filtrarTablaPorLocalStorage(data){
    //filtros del localstorage
    const filtros = filtrosLocalStorage();
    const nuevaData = data.map(obj => {
        const nuevoObj = {};
        filtros.forEach(atributo => {
            if (obj.hasOwnProperty(atributo)) {
                nuevoObj[atributo] = obj[atributo];
            }
        });
        return nuevoObj;
    });
    return nuevaData
}

//cuando se carga la pagina se pondran checked los checkbox que tiene sus valores en el localstorage
function checkboxPorLocalStorage(checkboxs){
    const filtros = filtrosLocalStorage();
    Array.from(checkboxs).forEach(check => {
        if(filtros.includes(check.value)) check.checked = true;
    })
}

//Obtengo la referencia de los dropdown-items
const dropdownItems = document.querySelectorAll('button.dropdown-item');

//recorro por cada dropdownItem y adhiero un evento para cuando se le hacer click en alguno de ellos
dropdownItems.forEach((item) =>{
    item.addEventListener('click', function() {
        //obtengo el valor del atributo que hice click
        const texto = item.getAttribute("data-value");
        //referencia al boton que aprieto para desplegar el dropdown
        const dropdown = document.getElementById("dropdownMenuButton");

        //cambio el textContent del dropdown para poder ver cual es el filtro, como se veria en el select
        dropdown.textContent = `Filtrado Tipo por: ${texto}`;
        //le cambio el data-value de boton desplegable y le asigno el filtro nuevo
        dropdown.setAttribute("data-value",texto);

        //Actualizo la tabla con el nuevo filtro tipo elegido
        actualizarTabla(URL);
    });
});

//Obtengo la referencia del button que despliega y retorno su atributo data.value
function dropdownFiltroTipo(){
    return document.getElementById("dropdownMenuButton").getAttribute("data-value");
}
