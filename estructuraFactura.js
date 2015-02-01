    //Estructura de la factura
    function Entidad(nombre, direccion, telefono, documento) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.documento = documento;
    }

    function Linea(descripcion, precio, cantidad) {
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    function Factura(id, empresa, cliente, formaPago, iva, lineas) {
        this.id = id;
        this.empresa = empresa;
        this.cliente = cliente;
        if (formaPago == "" || formaPago === undefined) {
            formaPago = "contado"
        }
        this.formaPago = formaPago;
        if(iva == "" || iva == undefined){
			iva = 21;
		}
        this.tipoIva = iva;
        if (lineas == "" || lineas == undefined){        	
            lineas = new Array();
        }
        this.lineas = lineas;
        
        this.importeTotal = 0;
        this.mostrarImporte = function () {
            return this.importeTotal;
        }
        this.addLinea = function (linea) {
        	console.log(this.lineas);
            this.lineas.push(linea);
        }
        this.removeLinea = function (linea){
        	console.log("borrar Linea");
        	var pos = this.lineas.indexOf(linea);
			this.lineas.splice(pos, 1);
        }

        this.actualizaImporte = function () {
            var total = 0;
            for (var i = 0; i < this.lineas.length; i++) {
                var subtotal = 0;
                var precio = 0;
                var cantidad = 0;
                precio = parseFloat(this.lineas[i].precio);
                cantidad = parseFloat(this.lineas[i].cantidad);
                subtotal = cantidad * precio;
                total += subtotal;
            }
            total += (total * (parseFloat(this.tipoIva) / 100));
            //console.log("total: "+total);
            this.importeTotal = Math.round(total * 100) / 100;
        }
    }
/*
    //Metodos de la factura
    Factura.prototype.mostrarImporte = function() {
        return this.importeTotal;
    }

    Factura.prototype.addLinea = function(linea) {
        this.linea.push(linea);
    }

    Factura.prototype.actualizaImporte = function() {
        var total = 0;
        for (var i = 0; i < this.linea.length; i++) {
            var subtotal = 0;
            var precio = 0;
            var cantidad = 0;
            precio = parseFloat(this.linea[i].precio);
            cantidad = parseInt(this.linea[i].cantidad);
            subtotal = cantidad * precio;
            total = total + subtotal;
        }
        total = total + (total * (parseFloat(this.tipoIva) / 100));
        this.importeTotal = Math.round(total * 100) / 100;
    }
*/
