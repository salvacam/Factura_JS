window.addEventListener("load", init);

function init() {

    document.getElementById("precio").addEventListener("keypress", filtroNumero, false);
    document.getElementById("cant").addEventListener("keypress", filtroNumero, false);

    function filtroNumero(e) {
        var codigo = e.charCode || e.keyCode;
        if (codigo < 32 || codigo == 37 || codigo == 38 || codigo == 39 || codigo == 40) {
            return;
        }
        var texto = String.fromCharCode(codigo);

        //var punto = false;
        var permitidos = "0123456789";
        if (permitidos.indexOf(texto) === -1 && codigo != 46) {
            // Es un carácter no permitido
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        } else if (e.target.value.indexOf('.') >=0 && codigo == 46) {
            // Ya tiene un punto
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }
    }

    function valoresDefecto() {
        if (localStorage.length > 0) {
            if (localStorage.getItem("facturaEmpresa") != undefined && localStorage.getItem("facturaEmpresa") != "") {
                var empresaDefecto = JSON.parse(localStorage.getItem("facturaEmpresa"));
                document.getElementById("nombreEmpresa").value = empresaDefecto.nombre;
                document.getElementById("direccionEmpresa").value = empresaDefecto.direccion;
                document.getElementById("telefonoEmpresa").value = empresaDefecto.telefono;
                document.getElementById("documentoEmpresa").value = empresaDefecto.documento;
            }
        }
    }

    var limpiarValores = function () {
        valoresDefecto();
        //document.getElementById("nombreCliente").value = "";
        //document.getElementById("direccionCliente").value = "";
        //document.getElementById("telefonoCliente").value = "";
        //document.getElementById("documentoCliente").value = ""
    };

    valoresDefecto();
    limpiarValores();



    var btdef = document.getElementById("defecto");
    btdef.addEventListener("click", function () {
        var nombre = document.getElementById("nombreEmpresa").value;
        var direccion = document.getElementById("direccionEmpresa").value;
        var telefono = document.getElementById("telefonoEmpresa").value;
        var nif = document.getElementById("documentoEmpresa").value;

        var error = "";
        var nombre = document.getElementById("nombreEmpresa").value;
        if (nombre.length < 2) {
            error += "El nombre de la empresa debe ser mayor de 2 caracteres\r\n";
        }
        var direccion = document.getElementById("direccionEmpresa").value;
        if (direccion.length < 5) {
            error += "La direccion de la empresa debe ser mayor de 5 caracteres\r\n";
        }
        var telefono = document.getElementById("telefonoEmpresa").value;
        var expresion = /^\d{9}$/;
        if (!expresion.test(telefono)) {
            error += "El teléfono de la empresa debe ser 9 números\r\n";
        }
        var nif = document.getElementById("documentoEmpresa").value;
        if (!validateCIF(nif)) { //A58818501
            error += "El nif de la empresa no es válido\r\n";
        }

        if (error != "") {
            alert(error);
        } else {
            if (confirm("¿Quieres guardar los valores?")) {
                var empresa = new Entidad(nombre, direccion, telefono, nif);
                localStorage.setItem("facturaEmpresa", JSON.stringify(empresa));
            }
        }
    });

    var limpiar = document.getElementById("limpiar");
    limpiar.addEventListener("click", limpiarValores);



    var remove = document.getElementById("remove");
    remove.addEventListener("click", function () {
        if (confirm("¿Quieres eliminar los valores?")) {
            document.getElementById("nombreEmpresa").value = "";
            document.getElementById("direccionEmpresa").value = "";
            document.getElementById("telefonoEmpresa").value = "";
            document.getElementById("documentoEmpresa").value = "";
            localStorage.removeItem("facturaEmpresa");
        }
    });

    comprobarCamposFactura = function () {
        var error = "";
        var nombre = document.getElementById("nombreEmpresa").value;
        if (nombre.length < 2) {
            error += "El nombre de la empresa debe ser mayor de 2 caracteres\r\n";
        }
        var direccion = document.getElementById("direccionEmpresa").value;
        if (direccion.length < 5) {
            error += "La direccion de la empresa debe ser mayor de 5 caracteres\r\n";
        }
        var telefono = document.getElementById("telefonoEmpresa").value;
        var expresion = /^\d{9}$/;
        if (!expresion.test(telefono)) {
            error += "El teléfono de la empresa debe ser 9 números\r\n";
        }
        var nif = document.getElementById("documentoEmpresa").value;
        if (!validateCIF(nif)) { //A58818501
            error += "El nif de la empresa no es válido\r\n";
        }

        var nombreC = document.getElementById("nombreCliente").value;
        if (nombreC.length < 2) {
            error += "El nombre del cliente debe ser mayor de 2 caracteres\r\n";
        }
        var direccionC = document.getElementById("direccionCliente").value;
        if (direccionC.length < 5) {
            error += "La direccion del cliente debe ser mayor de 5 caracteres\r\n";
        }
        var telefonoC = document.getElementById("telefonoCliente").value;
        if (!expresion.test(telefonoC)) {
            error += "El teléfono del cliente debe ser 9 números\r\n";
        }
        var dniC = document.getElementById("documentoCliente").value;
        if (dniC.length != 9) {
            error += "El dni del cliente debe ser 8 numeros y una letra\r\n";
        } else if (contieneLetra(dniC.substr(0, 8))) {
            error += "El dni del cliente debe ser 8 numeros y una letra\r\n";
        } else if (dniC.substr(-1).toUpperCase() != letraCorrecta(dniC.substr(0, 8))) {
            error += "La letra correcta del dni " + dniC.substr(0, 8) + " es " + letraCorrecta(dniC.substr(0, 8));
        }
        return error;
    }

    function contieneLetra(cadena) {
        var numeros = "0123456789";
        for (var i = 0; i < cadena.length; i++) {
            if (numeros.indexOf(cadena.charAt(i)) == -1) {
                return true;
            }
        }
        return false;
    }

    function letraCorrecta(dni) {
        var numeros = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X",
  "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
        return numeros[dni % 23];
    }

    /* * Tiene que recibir el cif sin espacios ni guiones */
    function validateCIF(cif) {

        //Quitamos el primer caracter y el ultimo digito 
        var valueCif = cif.substr(1, cif.length - 2);

        var suma = 0;

        //Sumamos las cifras pares de la cadena       
        for (i = 1; i < valueCif.length; i = i + 2) {
            suma = suma + parseInt(valueCif.substr(i, 1));
        }

        var suma2 = 0;

        //Sumamos las cifras impares de la cadena 
        for (i = 0; i < valueCif.length; i = i + 2) {
            result = parseInt(valueCif.substr(i, 1)) * 2;
            if (String(result).length == 1) {
                // Un solo caracter 
                suma2 = suma2 + parseInt(result);
            } else {
                // Dos caracteres. Los sumamos...
                suma2 = suma2 + parseInt(String(result).substr(0, 1)) + parseInt(String(result).substr(1, 1));
            }
        }

        // Sumamos las dos sumas que hemos realizado 
        suma = suma + suma2;

        var unidad = String(suma).substr(1, 1);
        unidad = 10 - parseInt(unidad);

        var primerCaracter = cif.substr(0, 1).toUpperCase();

        if (primerCaracter.match(/^[FJKNPQRSUVW]$/)) {

            //Empieza por .... Comparamos la ultima letra
            if (String.fromCharCode(64 + unidad).toUpperCase() == cif.substr(cif.length - 1, 1).toUpperCase())
                return true;
        } else if (primerCaracter.match(/^[XYZ]$/)) {
            //Se valida como un dni 
            var newcif;
            if (primerCaracter == "X")
                newcif = cif.substr(1);
            else if (primerCaracter == "Y")
                newcif = "1" + cif.substr(1);
            else if (primerCaracter == "Z")
                newcif = "2" + cif.substr(1);
            return validateDNI(newcif);
        } else if (primerCaracter.match(/^[ABCDEFGHLM]$/)) {
            //Se revisa que el ultimo valor coincida con el calculo
            if (unidad == 10)
                unidad = 0;
            if (cif.substr(cif.length - 1, 1) == String(unidad))
                return true;
        } else { //Se valida como un dni 
            return validateDNI(cif);
        }
        return false;
    }

    function validateDNI(dni) {
        var lockup = 'TRWAGMYFPDXBNJZSQVHLCKE';
        var valueDni = dni.substr(0, dni.length - 1);
        var letra = dni.substr(dni.length - 1, 1).toUpperCase();
        if (lockup.charAt(valueDni % 23) == letra)
            return true;
        return false;
    }
}