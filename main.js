// Captura de elementos html
//Elementos de Form Agregar/Modificar Producto
const formAgregarModif = document.querySelector("#formAgregarModif");
const contenedorProductos = document.querySelector("#contenedorProductos");
// const prod_id = document.querySelector("#prod_id");
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

//Form Buscar
const buscarProdDescrip = document.querySelector("#buscarProdDescrip");
const buscarProdPrecio1 = document.querySelector("#buscarProdPrecio1");
const buscarProdPrecio2 = document.querySelector("#buscarProdPrecio2");
const rubro_filtrar = document.querySelector("#rubro_filtrar");

// const btnFiltrar = document.querySelector("#btnFiltrar");
const btnreset = document.querySelector("#btnreset");
const selectSort = document.querySelector("#selectSort");



let modoEdicion = false;

let productoEditar;   //Va a contener el Objeto Producto a editar
let arrProductos = [];
let arr_productosFiltrados = [];  //Se utiliza para las funciones de Filtrado

//Funcion para almacenar al array arrProductos en el localStore
const guardarArrayLocalStore = () => {
  if (arrProductos.length > 0) {
    localStorage.setItem("arrProductos", JSON.stringify(arrProductos));
  }

}

//Funcion para levantar arrProductos del localStore
const getArrayLocalStore = () => {
  arrProductos = localStorage.getItem("arrProductos");
  if (arrProductos === null || arrProductos === "") {
    return false;
  } else {
    arrProductos = JSON.parse(arrProductos);

    return true;
  }
}


//FUNCIONES UTILIZADAS EN EL FORM AGREGAR/MODIFICAR
prod_preciocosto.oninput = () => {
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
    arrProductos[index].precioCosto = parseFloat(prod_preciocosto.value);
    arrProductos[index].utilidad = parseFloat(prod_utilidad.value);
    arrProductos[index].iva = parseFloat(prod_iva.value);
    arrProductos[index].precioFinal = parseFloat(prod_preciofinal.value);
    arrProductos[index].stock = parseFloat(prod_stock.value);
    arrProductos[index].rubro = parseInt(prod_rubro.value);
 
    //Aviso de edicion exitosa
    Toastify({
      text: "Producto editado exitosamente...",
      className: "info",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      position: "center", // `left`, `center` or `right`
    }).showToast();
    //Se restablecen la variable edicion y el texto del botom submit 
    modoEdicion = false;
    h2Element.innerText = "Agregar Producto"
    btnSubmit.innerText = "Agregar";
  } else {  //Nuevo
    //arrProductos.push

    arrProductos.push(new Producto(prod_descripcion.value, prod_preciocosto.value, prod_utilidad.value, prod_iva.value, prod_rubro.value, prod_stock.value));
    Toastify({
      text: "Se agrego el producto en forma exitosa...",
      className: "info",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
    }).showToast();
  }

  formAgregarModif.reset();// Se Resetea los valores del formulario
  guardarArrayLocalStore();
  mostrarProductos();
} //Fin onsubmit



//Si bien esta funcion es utilizada solamente desde una sola funcion,  se realiza para obtener un codigo más ordenado
function validarForm() {
  if (
    (prod_descripcion.value.trim() === "") ||
    (parseFloat(prod_preciocosto.value) <= 0 || isNaN(parseFloat(prod_preciocosto.value))) ||
    (parseFloat(prod_utilidad.value) <= 0 || isNaN(parseFloat(prod_utilidad.value))) ||
    (parseFloat(prod_iva.value) < 0 || isNaN(parseFloat(prod_iva.value))) ||
    (parseFloat(prod_rubro.value) <= 0 || isNaN(prod_rubro.value))
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Datos incompletos o incorrectos',
      text: 'Complete todos los campos correctamente...',
    });
    return false;
  }
  if (parseFloat(prod_stock.value) < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Stock',
      text: 'El Stock no puede ser negativo',
    });
    return false;
  }

  return true;
} //Fin validarForm
//FIN FUNCIONES UTILIZADAS EN EL FORM

//FUNCIONES DE BUSQUEDA, FILTRAR Y ORDENAR PRODUCTOS  
buscarProdDescrip.oninput = () => busquedaGrupal();
buscarProdPrecio1.oninput = () => busquedaGrupal();
buscarProdPrecio2.oninput = () => busquedaGrupal();
rubro_filtrar.oninput = () => busquedaGrupal();
// btnFiltrar.onclick = () => busquedaGrupal();

function busquedaGrupal() {
  let auxPrecio1 = parseFloat(buscarProdPrecio1.value);
  let auxPrecio2 = parseFloat(buscarProdPrecio2.value);
  isNaN(auxPrecio1) && (auxPrecio1 = 0);  //Operador Logico Simple
  isNaN(auxPrecio2) && (auxPrecio2 = 0);  //Operador Logico Simple
 

  //Se copia el array arrProductos para que los filtros no alteren la informacion
  arr_productosFiltrados = [...arrProductos];

  if (buscarProdDescrip.value.length !== 0) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      producto.descripcion.toLowerCase().includes(buscarProdDescrip.value.toLowerCase())
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

  //Se Filtra x Rubro
  if (!isNaN(rubro_filtrar.value)) {
    arr_productosFiltrados = arr_productosFiltrados.filter((producto) =>
      producto.rubro === parseInt(rubro_filtrar.value)
    );
  }

  if (arr_productosFiltrados.length > 0) {
    mostrarProductos();
  } else {
    contenedorProductos.innerHTML = "";   //contenedorProductos: div que contiene todos los subDiv de Productos
  }

} // Fin Funcion busquedaGrupal

btnreset.onclick = () => {    //Boton de Filtros
  arr_productosFiltrados = [];
  //buscarProdDescrip.value = "";
  mostrarProductos();
}

selectSort.oninput = () => {
  mostrarProductos();
}
// FUNCION ORDENAR
function sortArray(par_arrProductos, par_OrdenId) {
  let resultado = false;
  if (par_OrdenId >= 1 && par_OrdenId <= 4) {
    switch (par_OrdenId) {
      case 1:
        par_arrProductos.sort((a, b) => {
          if (a.descripcion.toLowerCase() > b.descripcion.toLowerCase()) {

            return 1;
          }
          if (a.descripcion.toLowerCase() < b.descripcion.toLowerCase()) {
            return -1;
          }
          // a es igual a b
          return 0;
        })
        resultado = true;
        break;
      case 2: //Ordenar x Menor Precio
        par_arrProductos.sort((a, b) => {
          if (a.precioFinal > b.precioFinal) {

            return 1;
          }
          if (a.precioFinal < b.precioFinal) {
            return -1;
          }
          // a es igual a b
          return 0;
        })
        resultado = true;
        break;
      case 3: //Ordenar x Mayor Precio
        par_arrProductos.sort((a, b) => {
          if (a.precioFinal < b.precioFinal) {

            return 1;
          }
          if (a.precioFinal > b.precioFinal) {
            return -1;
          }
          // a es igual a b
          return 0;
        })
        resultado = true;
        break;

      case 4: //Ordenar x Rubro
        par_arrProductos.sort((a, b) => {
          if (a.rubro > b.rubro) {

            return 1;
          }
          if (a.rubro < b.rubro) {
            return -1;
          }
          // a es igual a b
          return 0;
        })
        resultado = true;
        break;
    }
  } else {
    return false
  }
}//Fin Funcion Ordenar
// **FIN** FUNCIONES DE BUSQUEDA Y FILTRO PRODUCTOS. 

function formatearNumero(numero) {

  // Formatear con separadores de miles y 2 decimales
  return numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
}
//INICIO FUNCIONES UTILIZADAS EN LOS DIV DE MOSTRAR PRODUCTOS
const mostrarProductos = () => {
  let arrMostrarProduc = [];
  if (arr_productosFiltrados.length > 0) {
    arrMostrarProduc = [...arr_productosFiltrados];
  } else {
    arrMostrarProduc = [...arrProductos];
  }
  //Se ordena el array segun el Select Sort
  const opcionSort = parseInt(selectSort.value);
  sortArray(arrMostrarProduc, opcionSort);
  // Borramos el html para poner el array actualizado
  contenedorProductos.innerHTML = "";   //contenedorProductos: div que contiene todos los subDiv de Productos

  arrMostrarProduc.forEach((producto, index) => {
    const colorFondo = (index % 2) ? "colorFondo" : "bg-light"; //Operador Ternario
    //desestructuramos el objeto
    const {id, descripcion, precioFinal, stock, iva, rubro, precioCosto, utilidad } = producto;
    let divProductosContenedor = document.createElement("div");
    // divProductosContenedor.classList.add("col-12", "col-sm-6","mt-0", "border", "border-2", "p-3", "shadow", "shadow-md");
    divProductosContenedor.classList.add("row", "mt-0", "border", "border-2", "p-3", "shadow", "shadow-md", colorFondo);
 
    divProductosContenedor.innerHTML = `
    <div class="col-12 col-sm-6 border p-2 mt-2 mb-2">
      <p class="mb-0"><strong>Producto: ${descripcion}</strong></p>
      <p class="mb-0">Precio Venta: <strong>$${formatearNumero(precioFinal)}</strong></p>
      <p class="mb-0">Stock: ${stock}</p>
      <p class="mb-0">Stock: ${id}</p>
    </div>
    <div class="col-12 col-sm-6 border p-2 mt-2 mb-2 prod-2da-col">
    <p class="mb-0">Precio Costo: $${formatearNumero(precioCosto)}</p>
    <p class="mb-0">Utilidad: ${formatearNumero(utilidad)}</p>
    <p class="mb-0">Iva %: ${formatearNumero(iva)}</p>
    <p class="mb-0">Rubro Id.: ${rubro}</p>
  </div>
  `;
  let divBtnContenedor = document.createElement("div");
  divBtnContenedor.classList.add("mt-1", "mb-3", "border-bottom", "pb-1");
    //A continuacion del Div, se anexa el boton para ELIMINAR el producto
    let btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.innerHTML = "Eliminar";
    divBtnContenedor.appendChild(btnEliminar);
    btnEliminar.onclick = () => {
      Swal.fire({
        title: '¿Está seguro de eliminar el Producto?',
        text: "No se podra revertir el proceso",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarProducto(index);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado...',
            text: 'El Producto ha sido eliminado de la base de datos.',
          })

        }
      })

    };
    //Fin Boton Eliminar

    // Agregamos el botón editar
    let btnEditar = document.createElement("button");
    btnEditar.classList.add("btn", "btn-info", "ms-2");
    btnEditar.innerText = "Editar";
    divBtnContenedor.appendChild(btnEditar);
    btnEditar.onclick = () => {
      editarProducto(id);
    }
    //fin boton Editar

    //Se agrega el Div a el HTML  
    contenedorProductos.appendChild(divProductosContenedor);
    contenedorProductos.appendChild(divBtnContenedor);
    
  })

}

// Función de editar PRODUCTO del btnEditar de los Div de cada Producto
const editarProducto = (id) => {
  
  // let indexAux
  //indexAux = arrProductos.findIndex((producto => producto.id === arrProductosInclude[indexInclude].id))
  // if (arr_productosFiltrados.length > 0) {
    index = arrProductos.findIndex((producto => producto.id === id))
  // } 

  productoEditar = arrProductos[index];
  // prod_id.value = productoEditar.id;
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
}

//Funcion eliminarProducto de los div de cada Producto
function eliminarProducto(indice) {
  arrProductos.splice(indice, 1);
  guardarArrayLocalStore();
  mostrarProductos();
}
//FIN FUNCIONES UTILIZADAS EN LOS DIV DE MOSTRAR PRODUCTOS

//FUNCION PARA OBTENER DATOS DEL .JSON CON FETCH
const getArchJsonProductos = async () => {
  const resp = await fetch("./db/productos.json");
  const data = await resp.json();
  arrProductos = data;
  guardarArrayLocalStore();
  mostrarProductos();
  return data;
}

//Codigo que ses ejecuta al iniciar el Html
const bArrProdVacio = !getArrayLocalStore();  //Levanta el array del localStore

if (bArrProdVacio) {
  getArchJsonProductos()
} else {
  mostrarProductos();
}


