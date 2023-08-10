// Captura de elementos html
//Elementos de Form Agregar/Modificar Producto
const formAgregarModif = document.querySelector("#formAgregarModif");
const contenedorProductos = document.querySelector("#contenedorProductos");
const prod_id = document.querySelector("#prod_id");
const prod_descripcion = document.querySelector("#prod_descripcion");
const prod_preciocosto = document.querySelector("#prod_preciocosto");
const prod_utilidad = document.querySelector("#prod_utilidad");
const prod_iva = document.querySelector("#prod_iva");
const prod_preciofinal = document.querySelector("#prod_preciofinal");
const prod_rubro = document.querySelector("#prod_rubro");
const prod_stock = document.querySelector("#prod_stock");

const btncancelar = document.querySelector("#btncancelar");
const btnSubmit = document.querySelector("#btnsubmit");
//Fin Form Agregar/Modif
const h2Element = document.querySelector("#h2Form");

//Form Buscar x Descrip
const buscarProdDescrip = document.querySelector("#buscarProdDescrip");

//Form Filtrar x otros
const buscarProdPrecio1 = document.querySelector("#buscarProdPrecio1");
const buscarProdPrecio2 = document.querySelector("#buscarProdPrecio2");
const btnFiltrar = document.querySelector("#btnFiltrar");




let modoEdicion = false;
let productoEditar;   //Va a contener el Objeto Producto a editar
let arrProductos = [];
let arr_productosFiltrados = [];  //Se utiliza para las funciones de Filtrado

//Funcion para almacenar al array arrProductos en el localStore
const guardarArrayLocalStore = () => {
  localStorage.setItem("arrProductos", JSON.stringify(arrProductos));
}

//Funcion para levantar arrProductos del localStore
const getArrayLocalStore = () => {
  arrProductos = localStorage.getItem("arrProductos");
  //console.log("arrProductos:" + arrProductos);
  if (arrProductos === null || arrProductos === "") {
    return false;
  } else {
    arrProductos = JSON.parse(arrProductos);
    return true;
  }
}


//FUNCIONES UTILIZADAS EN EL FORM AGREGAR/MODIFICAR
prod_preciocosto.oninput = () => {
  console.log(prod_preciocosto.value);
  prod_preciofinal.value = precioVta(prod_preciocosto.value, prod_utilidad.value, prod_iva.value);
}

prod_utilidad.oninput = () => {
  prod_preciofinal.value = precioVta(prod_preciocosto.value, prod_utilidad.value, prod_iva.value);
}

prod_iva.oninput = () => {
  prod_preciofinal.value = precioVta(prod_preciocosto.value, prod_utilidad.value, prod_iva.value);
}

btncancelar.onclick = () => {
  modoEdicion = false;
  h2Element.innerText = "Agregar Producto"
  btnSubmit.innerText = "Agregar";
}

formAgregarModif.onsubmit = (event) => {
  // Prevenimos el comportamiento por defecto que tienen los formularios de recargarse la página
  event.preventDefault();

  if (!validarForm()) {
    return
  }
  if (modoEdicion) {
    let index = arrProductos.findIndex((producto) => producto.id === productoEditar.id);
    arrProductos[index].descripcion = prod_descripcion.value;
    arrProductos[index].precioCosto = prod_preciocosto.value;
    arrProductos[index].utilidad = prod_utilidad.value;
    arrProductos[index].iva = prod_iva.value;
    arrProductos[index].precioFinal = prod_preciofinal.value;
    arrProductos[index].stock = prod_stock.value;
    arrProductos[index].rubro = prod_rubro.value;

    //Se restablecen la variable edicion y el texto del botom submit 
    modoEdicion = false;
    h2Element.innerText = "Agregar Producto"
    btnSubmit.innerText = "Agregar";
  } else {  //Nuevo
    //arrProductos.push

    arrProductos.push(new Producto(prod_descripcion.value, prod_preciocosto.value, prod_utilidad.value, prod_iva.value, prod_rubro.value, prod_stock.value));

  }

  console.log(...arrProductos);

  formAgregarModif.reset();// Se Resetea los valores el formulario
  guardarArrayLocalStore();
  mostrarProductos();
} //Fin onsubmit



//Si bien esta funcion es utilizada solamente desde una sola funcion,  se realiza para obtener un codigo más ordenado
function validarForm() {
  let bresultado = true;

  if (prod_descripcion.value === "" || prod_descripcion.value.length === 0) {
    bresultado = false;
  }
  if (prod_preciocosto.value <= 0) {
    bresultado = false;
  }
  if (prod_utilidad.value <= 0) {
    bresultado = false;
  }
  if (prod_iva.value <= 0) {
    bresultado = false;
  }
  if (prod_rubro.value <= 0 || isNaN(prod_rubro.value)) {
    bresultado = false;
  }
  if (prod_stock.value < 0) {
    alert("El Stock no puede ser negativo")
    bresultado = false;
  }
  if (!bresultado) {
    alert("Por favor, complete todos los datos")
  }
  return (bresultado);
}
//FIN FUNCIONES UTILIZADAS EN EL FORM

//FUNCIONES DE BUSQUEDA Y FILTRO PRODUCTOS. 
buscarProdDescrip.oninput = (event) => {
  //alert("Entre. event.target.value: " + event.target.value);
  if (event.target.value === " ") {
    mostrarProductos(arrProductos);
  } else {
    if (arr_productosFiltrados.length === 0) {
      arr_productosFiltrados = arrProductos.filter((producto) =>
        producto.descripcion.toLowerCase().includes(event.target.value)
      );
    } else {  // Si arr_productosFiltrados no está vacío, se realiza la nueva busqueda dentro de los filtrados
      arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
        producto.descripcion.toLowerCase().includes(event.target.value)
      );
    }
    mostrarProductos(arr_productosFiltrados);
  }
}

btnFiltrar.onclick = () => busquedaGrupal()

function busquedaGrupal() {
  //Se copia el array arrProductos para que los filtros no alteren la informacion
  arr_productosFiltrados = [...arrProductos];
  let auxPrecio1 = parseFloat(buscarProdPrecio1.value);
  let auxPrecio2 = parseFloat(buscarProdPrecio2.value);
  if (isNaN(auxPrecio1)) {
    auxPrecio1 = 0;
  }
  if (isNaN(auxPrecio2)) {
    auxPrecio2 = 0;
  }
  if (buscarProdDescrip.value.length !== 0) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      producto.descripcion.toLowerCase().includes(event.target.value)
    );
  }
 
  //SE FILTRA EL RESULTADO POR EL RANGO DE PRECIOS
  if (auxPrecio1 > 0 && auxPrecio2 === 0) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      producto.precioFinal >= parseFloat(buscarProdPrecio1.value)
    );
  }

  if (auxPrecio1 === 0 && auxPrecio2 > 0) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      producto.precioFinal <= parseFloat(buscarProdPrecio2.value)
    );
  }
  if (auxPrecio1 > 0 && auxPrecio2 > 0) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      (producto.precioFinal >= parseFloat(buscarProdPrecio1.value) && producto.precioFinal <= parseFloat(buscarProdPrecio2.value))
    );
  }

  mostrarProductos(arr_productosFiltrados);

} //Fin Funcion busquedaGrupal

//-------------
// buscarProdPrecio1.oninput = (event) => {
//   console.log("Entre. buscarProdPrecio1 event.target.value: " + event.target.value);
//   //alert("Entre. buscarProdPrecio1 event.target.value: " + event.target.value);
//   if (event.target.value === "") {
//     mostrarProductos(arrProductos);
//   } else {
//     if (arr_productosFiltrados.length === 0) {
//       //alert("Entre x arr_productosFiltrados.length === 0");
//       arr_productosFiltrados = arrProductos.filter((producto) =>
//         producto.precioFinal >= parseFloat(event.target.value)
//       );
//     } else {  // Si arr_productosFiltrados no está vacío, se realiza la nueva busqueda dentro de los filtrados
//       //alert("Entre x arr_productosFiltrados.length <> 0");
//       arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
//         producto.precioFinal >= parseFloat(event.target.value)
//       );
//     }
//     mostrarProductos(arr_productosFiltrados);
//   }
// }
//------------------------
// **FIN** FUNCIONES DE BUSQUEDA Y FILTRO PRODUCTOS. 

//INICIO FUNCIONES UTILIZADAS EN LOS DIV DE MOSTRAR PRODUCTOS
const mostrarProductos = (par_arrProductos = arrProductos) => {
  // Borramos el html para poner el array actualizado
  contenedorProductos.innerHTML = "";   //contenedorProductos: div que contiene todos los subDiv de Productos

  par_arrProductos.forEach((producto, index) => {
    let divProductosContenedor = document.createElement("div");
    divProductosContenedor.classList.add("mt-0", "border", "border-2", "p-3", "shadow", "shadow-md");
    divProductosContenedor.innerHTML = `
    <p class="mb-0">Producto: ${producto.descripcion}</p>
    <p class="mb-0">Precio: ${producto.precioFinal}</p>
    <p class="mb-0">Stock: ${producto.stock}</p>
  `;
    //A continuacion del Div, se anexa el boton para ELIMINAR el producto
    let btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.innerHTML = "Eliminar";
    divProductosContenedor.appendChild(btnEliminar);

    btnEliminar.onclick = () => {
      let confirmar = confirm("¿Estas seguro que deseas eliminar el Producto?");
      if (confirmar) {
        eliminarProducto(index);
        alert("Eliminación Exitosa");
      } else {
        alert("Eliminación cancelada");
      }
    };
    //Fin Boton Eliminar

    // Agregamos el botón editar
    let btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "btn-info", "ms-2");
    btnEditar.innerText = "Editar";
    divProductosContenedor.appendChild(btnEditar);

    btnEditar.onclick = () => editarProducto(index);
    //fin boton Editar

    //Se agrega el Div a el HTML  
    contenedorProductos.appendChild(divProductosContenedor);
  })

}

// Función de editar PRODUCTO del btnEditar de los Div de cada Producto
const editarProducto = (index) => {

  productoEditar = arrProductos[index];

  prod_id.value = productoEditar.id;
  prod_descripcion.value = productoEditar.descripcion;
  prod_preciocosto.value = productoEditar.precioCosto;
  prod_utilidad.value = productoEditar.utilidad;
  prod_iva.value = productoEditar.iva;
  prod_preciofinal.value = productoEditar.precioFinal;
  prod_stock.value = productoEditar.stock;
  prod_rubro.value = productoEditar.rubro;
  //let precio
  modoEdicion = true;
  h2Element.innerText = "Modificacion del Producto"
  btnSubmit.innerText = "Grabar";
  prod_descripcion.focus();
};

//Funcion eliminarProducto de los div de cada Producto
function eliminarProducto(indice) {
  arrProductos.splice(indice, 1);
  guardarArrayLocalStore();
  mostrarProductos();
}
//FIN FUNCIONES UTILIZADAS EN LOS DIV DE MOSTRAR PRODUCTOS

//INSTRUCCIONES QUE SE EJECUTAN AL INICIAR EL HTML
const bArrProdVacio = !getArrayLocalStore();  //Levanta el array del localStore
if (bArrProdVacio) {
  arrProductos = [
    new Producto("Tomate en lata x 200 grs", 200, 40, 21, 1, 2),
    new Producto("Yerba Playadito 500 grs.", 700, 40, 21, 1, 0),
    new Producto("Pan Felipe x 1 kgs", 750, 40, 21, 3, 3),
    new Producto("Pan frances x 1 kgs", 800, 40, 21, 3, 1),
    new Producto("Corte Nalga x 1 kgs.", 2500, 40, 21, 2, 40),
    new Producto("Corte Lomo x 1 kgs.", 3000, 40, 21, 2, 5),
    new Producto("Servilletas x 50 u.", 200, 40, 21, 4, 10),
    new Producto("Lampara Led 7w", 1500, 40, 21, 4, 20)
  ];
  guardarArrayLocalStore();
}

mostrarProductos();

