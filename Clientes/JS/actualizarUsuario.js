const docClie = localStorage.getItem("documentocliente");

function completarCampos(id) {
    fetch("http://localhost:8084/cliente/" + id)
        .then(response => response.json())
        .then(data => {
            document.getElementById("nombre").value = data.nomCli;
            document.getElementById("apellido").value = data.apeCli;
            document.getElementById("telefono").value = data.telCli;
            document.getElementById("correo").value = data.corCli;
            document.getElementById("contrasena").value = data.conCli;
            document.getElementById("contrasena2").value = data.conCli;
        })
        .catch(error => {
            console.error("Error en la solicitud de completar campos: " + error);
        });
}

function enviarCorreo(emailRequest) {
    fetch("http://localhost:8084/send-email", {
        method: "POST",
        body: JSON.stringify(emailRequest),
        headers: {
            "Content-type": "application/json",
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al enviar el correo');
            }
            return res.json();
        })
        .then(data => {
            alert("Correo enviado exitosamente");
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function actualizarCampos(id) {
    const documento = localStorage.getItem("documentocliente");
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const contrasena2 = document.getElementById("contrasena2").value;

    if (nombre.length === 0 && apellido.length === 0 && telefono.length === 0 && contrasena.length === 0 && contrasena2.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }
    const telefonoRegex = /^3[0-9]{9}$/;
    const correoRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (/^\s*$/.test(nombre) && /^\s*$/.test(apellido)) {
        Swal.fire(
            'No puede enviar campos en blanco',
            'Ops...',
            'warning'
        );
        return;
    }
    else {
        if (nombre.length == 0 || apellido.length == 0) {

            if (nombre.length == 0) {
                Swal.fire(
                    'El campo nombre es obligatorio',
                    'Ops...',
                    'warning'
                );
                return;
            }
            if (apellido.length == 0) {
                Swal.fire(
                    'El campo apellido es obligatorio',
                    'Ops...',
                    'warning'
                );
                return;
            }

            return;
        }
    }

    if (nombre.trim().length < 3) {
        Swal.fire("Oops...", "El nombre es inválido", "warning");
        return;
    }
    if (apellido.trim().length < 3) {
        Swal.fire("Oops...", "El apellido es inválido", "warning");
        return;
    }



    if (!telefono.match(telefonoRegex) || telefono.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'El número de teléfono es inválido',
        });
        return;
    }

    if (!correo.match(correoRegex) || correo.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'La dirección de correo electrónico es inválida.',
        });
        return;
    }

    if (!contrasena.match(contrasenaRegex) || contrasena.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'La contraseña debe ser mayor a 7 caracteres, contener al menos una mayúscula y al menos un número',
        });
        return;
    }

    if (contrasena !== contrasena2) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Las contraseñas no coinciden',
        });
        return;
    }

    const datosActualizados = {
        docCli: documento,
        nomCli: nombre.trim(),
        apeCli: apellido.trim(),
        telCli: telefono,
        corCli: correo,
        conCli: contrasena,
    };

    fetch("http://localhost:8084/cliente/cliente/corcli/" + documento)
        .then((res) => res.json())
        .then((clienteData) => {
            const correoCliente = clienteData[0]
            if (correo.trim() !== correoCliente) {
                fetch("http://localhost:8084/cliente/correo/" + correo)
                    .then((res) => res.json())
                    .then((existeCorreo) => {
                        if (existeCorreo) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Correo ya existente!',
                            });
                        } else {
                            fetch("http://localhost:8084/cliente/" + id, {
                                method: "PUT",
                                body: JSON.stringify(datosActualizados),
                                headers: {
                                    "Content-Type": "application/json",
                                }
                            })
                                .then(
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Cliente actualizado con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                )
                                .then(response => response.json())
                                .then(data => {
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                })
                                .catch(error => {
                                    console.error("Error en la solicitud de actualización: " + error);
                                });
                            const emailRequest = {
                                to: correoCliente,
                                body: 'Actualización exitosa en Stilo Chain WEB'
                            };

                            enviarCorreo(emailRequest);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                const datosActualizados2 = {
                    docCli: documento,
                    nomCli: nombre.trim(),
                    apeCli: apellido.trim(),
                    telCli: telefono,
                    corCli: correoCliente,
                    conCli: contrasena,
                };
                fetch("http://localhost:8084/cliente/" + id, {
                    method: "PUT",
                    body: JSON.stringify(datosActualizados2),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Cliente actualizado con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        const emailRequest = {
                            to: correoCliente,
                            subject: "Actualización exitosa en Stilo Chain WEB",
                            body: `Actualización exitoso. ¡Tus datos han sido actualizados!\nRecuerda que debes entrar a la página con tu documento y contraseña\nDocumento: ${localStorage.getItem("documentocliente")}\nContraseña: ${document.getElementById("contrasena").value}`
                        };

                        enviarCorreo(emailRequest);

                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    })
                    .catch(error => {
                        console.error("Error en la solicitud de actualización: " + error);
                    });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

completarCampos(docClie);

document.getElementById("actualizar").addEventListener("click", () => {
    actualizarCampos(docClie);
});


// ---------- VALIDACIONES ----------


var nombres = document.getElementById('nombre');

// Agrega un oyente de eventos para el evento 'input'
nombres.addEventListener('input', function () {
    // Elimina cualquier carácter que NO sea una letra en español (incluyendo espacios)
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
});

var apellidos = document.getElementById('apellido');

// Agrega un oyente de eventos para el evento 'input'
apellidos.addEventListener('input', function () {
    // Elimina cualquier carácter que NO sea una letra en español (incluyendo espacios)
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
});

var telefono = document.getElementById('telefono');
// Agrega un oyente de eventos para el evento 'input'
telefono.addEventListener('input', function () {
    // Elimina cualquier carácter que NO sea un número o el carácter '-'
    this.value = this.value.replace(/[^0-9-]/g, '');
});
// Evita que se ingresen espacios en blanco en un (input)

var correo = document.getElementById('correo');

// Agrega un oyente de eventos para el evento 'input'
correo.addEventListener('input', function () {
    this.value = this.value.replace(/[ ]/g, '');
});

// Evita que se ingresen espacios en blanco en un (input)

var contraseña = document.getElementById('contrasena');
var contraseña2 = documento.getElementById('contrasena2')

// Agrega un oyente de eventos para el evento 'input'
contraseña.addEventListener('input', function () {
    this.value = this.value.replace(/[ ]/g, '');
});

contraseña2.addEventListener('input', function () {
    this.value = this.value.replace(/[ ]/g, '');
});

//VALIDACION CON JQUERY QUE NO PERMITE EL CARACTER INGRESADO SEGÚN EL CODIGO ASCII

jQuery('#nombres').keypress(function (tecla) {
    if ((tecla.charCode >= 65 && tecla.charCode <= 90) || (tecla.charCode >= 97 && tecla.charCode <= 122)) return true;
    else return false;
});

jQuery('#apellidos').keypress(function (tecla) {
    if ((tecla.charCode >= 65 && tecla.charCode <= 90) || (tecla.charCode >= 97 && tecla.charCode <= 122)) return true;
    else return false;
});

