
    //precioVta: Se saco fuera de la clase para poder utilizarla desde otras funciones
    precioVta = (parPrecioCosto, parUtilidad, parIva) => {
        
        let auxPrecioFinal;
        auxPrecioFinal = parPrecioCosto * (1 + parUtilidad / 100);
        auxPrecioFinal = auxPrecioFinal * (1 + parIva / 100);
        auxPrecioFinal = parseFloat(auxPrecioFinal.toFixed(2));
        return (auxPrecioFinal)
    }

class Producto {
    constructor(descripcion = "", precioCosto = 0, utilidad = 0, iva = 0, rubro = 0, stock = 0) {
        this.id = this.generarIdUnico();
        this.descripcion = descripcion;
        this.precioCosto = precioCosto;
        this.utilidad = utilidad;
        this.iva = iva;
        this.rubro = rubro;
        this.stock = stock;
        this.precioFinal = parseFloat(precioVta(this.precioCosto, this.utilidad, this.iva));

    }
 
    generarIdUnico() {
        const parteAleatoria = Math.random().toString(36).substr(2, 9); // Genera una cadena aleatoria de 9 caracteres
        const marcaDeTiempo = Date.now().toString(36); // Convierte la marca de tiempo a una cadena hexadecimal
        const idUnico = parteAleatoria + marcaDeTiempo; // Combina la parte aleatoria con la marca de tiempo
        return idUnico;
    }
    //Se saco fuera de la clase para poder utilizarla desde otras funciones
    // precioVta() {
    //     let auxPrecioFinal;
    //     auxPrecioFinal = parPrecioCosto * (1 + parUtilidad / 100);
    //     auxPrecioFinal = auxPrecioFinal * (1 + parIva / 100);
    //     return (auxPrecioFinal)
    // }
}

