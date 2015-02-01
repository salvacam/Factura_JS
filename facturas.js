window.addEventListener("load", init);

function init() {

    //Leer facturas
    var id = 1;
    var facturaActual = null;
    //localStorage.clear();

    function leer() {
        var lista = document.getElementById("listado");
        lista.innerHTML = "";
        if (localStorage.length > 0) {
            for (var i in localStorage) {
                if (i.substring(0, 8) == "factura_") {
                    var fact = JSON.parse(localStorage[i]);
                    var pos = fact.id;
                    if (id <= pos) {
                        id = pos + 1;
                    }
                    var elemento = document.createElement("li");
                    var enlace = document.createElement("a");
                    enlace.setAttribute("href", "#");
                    enlace.setAttribute("class", "enlaces");
                    enlace.setAttribute("data-id", pos);
                    enlace.innerHTML = mostrarDatosSimplificados(fact);
                    elemento.appendChild(enlace);

                    var enlaceBorrar = document.createElement("a");
                    enlaceBorrar.setAttribute("href", "#");
                    enlaceBorrar.setAttribute("class", "borrar");
                    enlaceBorrar.setAttribute("data-id", pos);
                    enlaceBorrar.textContent = "Borrar";
                    elemento.appendChild(enlaceBorrar);
                    lista.appendChild(elemento);
                }
            }
        }

        var enlaces = document.getElementsByClassName("enlaces");
        for (var i = 0; i < enlaces.length; i++) {
            enlaces[i].addEventListener("click", function (evento) {
                var enlace = evento.target;
                var pos = enlace.getAttribute("data-id");
                var fact = JSON.parse(localStorage.getItem("factura_" + pos));
                //console.log(fact);
                mostrarFactura(fact);
                facturaActual = new Factura(fact.id, fact.empresa, fact.cliente,
                    fact.formaPago, fact.tipoiva, fact.lineas);
                //Factura(id, empresa, cliente, formaPago, iva, lineas)
                facturaActual.actualizaImporte();
                //console.log(facturaActual);
                document.getElementById("linea").removeAttribute("hidden");
                document.getElementById("desc").value = "";
                document.getElementById("precio").value = "";
                document.getElementById("cant").value = "";


                var borrarLineas = document.getElementsByClassName("removeLinea");
                
                funBorarLineas = function () {
                    for (var i = 0; i < borrarLineas.length; i++) {
                        borrarLineas[i].addEventListener("click", function () {
                            console.log("borrar linea");
                            if (confirm("¿Quieres borrar la línea?")) {
                                facturaActual.removeLinea(facturaActual.lineas[i]);
                                facturaActual.actualizaImporte();
                                var clave = "factura_" + facturaActual.id;
                                localStorage.setItem(clave, JSON.stringify(facturaActual));
                                leer();
                                mostrarFactura(facturaActual);
                                funBorarLineas();
                            }
                        });
                    }
                };
                funBorarLineas();
            });
        }

        var enlacesBorrar = document.getElementsByClassName("borrar");
        for (var i = 0; i < enlacesBorrar.length; i++) {
            enlacesBorrar[i].addEventListener("click", function (evento) {
                var enlaceBorrar = evento.target;
                var pos = enlaceBorrar.getAttribute("data-id");
                if (confirm('¿Está Seguro de eliminar la factura ' + pos + '?')) {
                    localStorage.removeItem("factura_" + pos);
                    leer();
                    //mejorar
                    document.getElementById("mostrar").innerHTML = "";
                    document.getElementById("linea").setAttribute("hidden", "");
                }
            });
        }
    }

    leer();

    // Guardar datos
    var save = document.getElementById("guardar");
    save.addEventListener("click", function () {
        //Creacion de una factura
        if (comprobarCamposFactura() == "") {
            var nomE = document.getElementById("nombreEmpresa").value;
            var dirE = document.getElementById("direccionEmpresa").value;
            var telE = document.getElementById("telefonoEmpresa").value;
            var docE = document.getElementById("documentoEmpresa").value;
            var empresa = new Entidad(nomE, dirE, telE, docE);

            var nomC = document.getElementById("nombreCliente").value;
            var dirC = document.getElementById("direccionCliente").value;
            var telC = document.getElementById("telefonoCliente").value;
            var docC = document.getElementById("documentoCliente").value;
            var cliente = new Entidad(nomC, dirC, telE, docC);

            var tipoPago = document.getElementsByName("pago");
            var pago = "";
            for (var i = 0; i < tipoPago.length; i++) {
                if (tipoPago[i].checked) {
                    pago = tipoPago[i].value;
                }
            }

            var tipoIva = document.getElementsByName("iva");
            var iva = "";
            for (var i = 0; i < tipoIva.length; i++) {
                if (tipoIva[i].checked) {
                    iva = tipoIva[i].value;
                }
            }

            var factura = new Factura(id, empresa, cliente, pago, iva);
            factura.actualizaImporte();

            var clave = "factura_" + id;
            localStorage.setItem(clave, JSON.stringify(factura));
            leer();
            document.getElementById("mostrar").innerHTML = "";
            document.getElementById("linea").setAttribute("hidden", "");
        } else {
            alert(comprobarCamposFactura());
        }
    });

    var add = document.getElementById("addLinea");
    add.addEventListener("click", function () {
        var desc = document.getElementById("desc").value;
        var precio = document.getElementById("precio").value;
        var cant = document.getElementById("cant").value;

        var error = "";
        if (desc.length < 2) {
            error += "La descripción debe ser mayor de 2 caracteres\r\n";
        }
        if (precio.length < 1) {
            error += "Introduce un precio\r\n";
        }
        if (cant.length < 1) {
            error += "Introduce una cantidad\r\n";
        }
        if (error != "") {
            alert(error);
            return;
        }

        document.getElementById("desc").value = "";
        document.getElementById("precio").value = "";
        document.getElementById("cant").value = "";

        var linea = new Linea(desc, precio, cant);
        console.log(linea);
        if (facturaActual != null && facturaActual != undefined) {
            console.log("añade linea");
            facturaActual.addLinea(linea);
            facturaActual.actualizaImporte();
            var clave = "factura_" + facturaActual.id;
            localStorage.setItem(clave, JSON.stringify(facturaActual));
        }
        leer();
        mostrarFactura(facturaActual);
        funBorarLineas();
    });

    var comprobarCampos = function () {
            var nombre = document.getElementById("nombreEmpresa").value;
            var direccion = document.getElementById("direccionEmpresa").value;
            var telefono = document.getElementById("telefonoEmpresa").value;
            var nif = document.getElementById("documentoEmpresa").value;

            if (nombre == "" || direccion == "" || telefono == "" || nif == "") {
                alert("valores Empresa vacio");
                return false;
            }

            var nombreC = document.getElementById("nombreCliente").value;
            var direccionC = document.getElementById("direccionCliente").value;
            var telefonoC = document.getElementById("telefonoCliente").value;
            var nifC = document.getElementById("documentoCliente").value;

            if (nombreC == "" || direccionC == "" || telefonoC == "" || nifC == "") {
                alert("valores Cliente vacio");
                return false;
            }
            return true;
        }
        //Metodos para trabajar con las facturas

    function mostrarFactura(fact) {
        var mostrar = document.getElementById("mostrar");
        if (mostrar.hasChildNodes()) {
            while (mostrar.childNodes.length >= 1) {
                mostrar.removeChild(mostrar.firstChild);
            }
        }
        var par = document.createElement("p");
        //fact.actualizaImporte;
        //console.log(fact.mostrarImporte); // no funciona
        par.textContent = "Total factura: " + fact.importeTotal + " €.";

        var par1 = document.createElement("p");
        par1.innerHTML = mostrarDatos(fact);
        mostrar.appendChild(par);
        mostrar.appendChild(par1);
    }

    function mostrarDatosSimplificados(factura) {
        var salida = "";
        for (prop in factura) {
            if (prop != "lineas" && prop != "empresa") {
                if (typeof (factura[prop]) == "object") {
                    salida += prop + "-> ";
                    salida += mostrarDatos(factura[prop]) + "<br/>";
                } else if (typeof (factura[prop]) != "function") {
                    salida += prop + ": " + factura[prop] + "<br/>";
                }
            }
        }
        return salida;
    }

    function mostrarDatos(factura) {
        var salida = "";
        for (prop in factura) {
            if (typeof (factura[prop]) == "object") {
                salida += prop + "-><br/>";
                salida += mostrarDatos(factura[prop]);
                salida += "<br/>";
            } else if (typeof (factura[prop]) != "function") {
                //console.log(prop);
                salida += prop + ": " + factura[prop] + "<br/>";
                //console.log(prop);
                if (prop == "cantidad") {
                    salida += "&nbsp;&nbsp;&nbsp;<input type='button' class='removeLinea' value='borrar'/> ";
                }
            }
        }
        return salida;
    }
}