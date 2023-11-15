const limpiar = () => {
    $("#id").val("");
    $("#nombre").val("");
    $("#precio").val("");
    $("#duracion").val("");
    $("#imagen").val("");
};

const guardarServicio = () => {
    const nuevoNombre = $("#nombre").val();
    const nuevoPrecio = $("#precio").val();
    const nuevaDuracion = $("#duracion").val();
    const imagenFile = document.getElementById("imagen").files[0];

    if (nuevoNombre.length === 0 && nuevaDuracion.length === 0 && nuevaDuracion.length === 0) {
        Swal.fire({
            title: 'Oops',
            text: "Todos los campos son obligatorios",
            icon: 'warning',
        });
        return
    }


    if (/^\s*$/.test(nuevoNombre)) {
        Swal.fire(
            'No puede enviar campos en blanco',
            'Ops...',
            'warning'
        );
        return;
    } else {
        if (nuevoNombre.trim() === "") {
            Swal.fire({
                title: 'Oops',
                text: "El campo de nombre no puede estar vacío.",
                icon: 'warning',
            });
            return
        }
    }

    if (nuevoPrecio < 8000 || nuevoPrecio > 1000000) {
        Swal.fire({
            title: 'Oops',
            text: "El precio debe estar entre 8,000 y 1,000,000",
            icon: 'warning',
        });
        return;
    }

    if (nuevaDuracion < 10 || nuevaDuracion > 300) {
        Swal.fire({
            title: 'Oops',
            text: "La duración debe estar entre 10 y 300 minutos.",
            icon: 'warning',
        });
        return;
    }

    if (nuevaDuracion.trim() === "") {
        Swal.fire({
            title: 'Oops',
            text: "El campo de duración no puede estar vacío.",
            icon: 'warning',
        });
        return
    }

    if (!imagenFile) {
        Swal.fire({
            title: 'Oops',
            text: "Debe seleccionar una imagen.",
            icon: 'warning',
        });
        return
    }

    // Validaciones de formato para nombre y precio
    const nombreRegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
    const precioRegExp = /^[0-9,.]+/;

    if (!nombreRegExp.test(nuevoNombre)) {
        Swal.fire({
            title: 'Oops',
            text: "El campo de nombre contiene caracteres no permitidos. Solo se permiten letras.",
            icon: 'warning',
        });
        return
    }

    if (!precioRegExp.test(nuevoPrecio)) {
        Swal.fire({
            title: 'Oops',
            text: "El campo de precio contiene caracteres no permitidos. Solo se permiten números, comas y puntos.",
            icon: 'warning',
        });
        return
    }




    return fetch('http://localhost:8084/stilochain-0.0.1-SNAPSHOT/servicio/cita-names')
        .then(res => res.json())
        .then(res => {
            const nombreExistente = res.find(nombre => nombre.toLowerCase() === nuevoNombre.toLowerCase().trim());
            if (nombreExistente) {
                Swal.fire({
                    title: 'Oops',
                    text: "El nombre ya existe, no se puede guardar el servicio.",
                    icon: 'error',
                })
                return
            }

            const datosServicio = {
                nombre: nuevoNombre.trim(),
                precio: nuevoPrecio.trim(),
                duracion: nuevaDuracion.trim(),
            };

            return fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/servicio/guardar", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },

                body: JSON.stringify(datosServicio)
            })
                .then(response => response.json())
                .then(data => {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Servicio guardado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    guardarImagen(data.id);
                    return data
                })
                .then()
        });
};

const guardarHorasEnIntervalo = (idServicio, duracion) => {
    const horaInicio = new Date();
    horaInicio.setHours(8, 0, 0, 0);

    const horaFin = new Date();
    horaFin.setHours(20, 0, 0, 0);

    const intervaloEnMinutos = parseInt(duracion);
    const intervalos = Math.floor(((horaFin - horaInicio) / (1000 * 60)) / intervaloEnMinutos);

    let horaActual = new Date(horaInicio);

    for (let i = 0; i < intervalos; i++) {
        const hora = horaActual.getHours();
        const minutos = horaActual.getMinutes();

        let ampm = 'AM';
        let hora12 = hora;

        if (hora >= 12) {
            ampm = 'PM';
            hora12 = hora === 12 ? 12 : hora - 12;
        }

        const minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
        const horaFormateada = hora12 + ":" + minutosFormateados + " " + ampm;



        guardarHora(idServicio, horaFormateada)
            .then(response => {
                if (!response.ok) {
                }
                return response.json();
            })
            .then(data => {
                console.log("Hora enviada al servidor con éxito:", data);
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
            });

        horaActual.setMinutes(horaActual.getMinutes() + intervaloEnMinutos);
    }
};

const guardarHora = (id, horaFormateada) => {
    return fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/hora/guardar", {
        method: "POST",
        body: JSON.stringify({
            "idservi": id,
            "hora": horaFormateada
        }),
        headers: {
            "Content-type": "application/json"
        }
    });
};
const redimensionarImagen = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let newWidth = img.width;
                let newHeight = img.height;

                if (img.width > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = (maxWidth / img.width) * img.height;
                }

                if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = (maxHeight / img.height) * img.width;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                resolve(canvas.toDataURL("image/jpeg")); // Cambia el formato según tus necesidades (jpeg, png, etc.).
            };

            img.onerror = reject;
        };

        reader.readAsDataURL(file);
    });
};


const guardarImagen = async (idServicio) => {
    const fileInput = document.getElementById("imagen");
    const file = fileInput.files[0];

    if (file) {
        try {
            const base64Data = await redimensionarImagen(file, 400, 400);

            const response = await fetch(`http://localhost:8084/stilochain-0.0.1-SNAPSHOT/servicio/imagen/`, {
                method: "PUT",
                body: JSON.stringify({
                    "id": idServicio,
                    "imagen": base64Data
                }),
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (response.ok) {
                console.log("Imagen enviada al servidor con éxito.");
            } else {
                console.error("Error al enviar la imagen al servidor.");
            }
        } catch (error) {
            console.error("Error al procesar la imagen:", error);
        }
    } else {
        console.log("Error: No se ha seleccionado una imagen.");
    }
};

let error = false;

const create = () => {
    $("#btnGuardar").on("click", function () {
        const duracion = $("#duracion").val();

        error = false;

        guardarServicio()
            .then(data => {
                const idServicio = data.id;
                guardarHorasEnIntervalo(idServicio, duracion);
                limpiar();
            })
            .catch(error => {
                console.error("Error al guardar el servicio:", error);
                error = true;
            })
    });
};

// Llamar a la función create para configurar el evento al hacer clic en el botón Guardar
create();

var nombres = document.getElementById('nombre');


jQuery('#nombre').keypress(function (tecla) {
    var charCode = tecla.charCode;
    if (
        (charCode >= 65 && charCode <= 90) || // Letras mayúsculas en inglés
        (charCode >= 97 && charCode <= 122) || // Letras minúsculas en inglés
        (charCode === 241) || // Letra "ñ"
        (charCode === 209) || // Letra "Ñ"
        (charCode === 225) || // Letra "á"
        (charCode === 233) || // Letra "é"
        (charCode === 32) || // Espacio
        (charCode === 237) || // Letra "í"
        (charCode === 243) || // Letra "ó"
        (charCode === 250) || // Letra "ú"
        (charCode === 193) || // Letra "Á"
        (charCode === 201) || // Letra "É"
        (charCode === 205) || // Letra "Í"
        (charCode === 211) || // Letra "Ó"
        (charCode === 218) || // Letra "Ú"
        (charCode === 252) || // Letra "ü"
        (charCode === 220) // Letra "Ü"
    ) {
        return true;
    } else {
        return false;
    }
});

