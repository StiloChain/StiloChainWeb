function limpiarCampos() {
  var elementos = document.querySelectorAll("input");
  elementos.forEach(function (elemento) {
    elemento.value = "";
  });

  var selectElementRol = document.getElementById("rol");
  if (selectElementRol) {
    selectElementRol.selectedIndex = 0;
  }

  var selectElementOcupacion = document.getElementById("ocupaciones");
  if (selectElementOcupacion) {
    selectElementOcupacion.selectedIndex = 0;
  }
}

function alerta() {
  Swal.fire("Guardado!", "El empleado ha sido guardado!", "success");
}

function enviarCorreo(emailRequest) {
  return fetch("http://localhost:8084/send-email", {
    method: "POST",
    body: JSON.stringify(emailRequest),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw Error("Error al enviar el correo");
      }
      return response.json();
    })
    .then(function (data) {
      alert("Correo enviado exitosamente");
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}

function verificarExistenciaDocumento(documento) {
  return fetch("http://localhost:8084/empleado/" + documento).then(function (
    response
  ) {
    if (!response.ok) {
      throw new Error("Error al verificar la existencia del documento");
    }
    return response.json();
  });
}

function verificarExistenciaCorreo(correo) {
  return fetch("http://localhost:8084/empleado/correo/" + correo).then(
    function (response) {
      if (!response.ok) {
        throw new Error("Error al verificar la existencia del correo");
      }
      return response.json();
    }
  );
}

function guardarEmpleado(data) {
  return fetch("http://localhost:8084/empleado/guardar", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error al guardar el empleado");
      }
      return response.json();
    })
    .then(function (responseData) {
      const doc = responseData.docemp;
      guardarImagen(doc);
    })
    .catch(function (error) {
      console.error("Error al guardar el empleado:", error);
    });
}



var selectElementOcupacion = document.getElementById("ocupaciones");
selectElementOcupacion.disabled = true;

function validarOcupacion() {
  var selectElementRol = document.getElementById("rol");
  var selectElementOcupacion = document.getElementById("ocupaciones");
  var seleccionado = selectElementRol.value;

  if (seleccionado === '0') {
    selectElementOcupacion.disabled = true;
  } else if (seleccionado === '1') {
    selectElementOcupacion.disabled = true;
    selectElementOcupacion.selectedIndex = 0;
  }

  else {
    selectElementOcupacion.disabled = false;
  }
}

const guardar = document.getElementById("btnGuardar");

guardar.addEventListener("click", function () {
  var documento = document.getElementById("documento").value;
  var nombres = document.getElementById("nombres").value;
  var apellidos = document.getElementById("apellidos").value;
  var telefono = document.getElementById("telefono").value;
  var correo = document.getElementById("correo").value;
  var contraseña = document.getElementById("contraseña").value;

  // EXPRESIONES REGULARES
  const regexCedulaColombiana = /^\d{7,10}$/;
  const regexTelefono = /^3[0-9]{9}$/;
  const regexCorreoElectronico = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const regexContraseña = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (
    documento.length === 0 ||
    nombres.length === 0 ||
    apellidos.length === 0 ||
    telefono.length === 0 ||
    correo.length === 0 ||
    contraseña.length === 0
  ) {
    Swal.fire("Oops...", "Todos los campos son obligatorios", "error");
    return;
  }

  // Validar documento
  if (!regexCedulaColombiana.test(documento)) {
    Swal.fire("Oops...", "Se espera que el documento tenga entre 7 y 10 dígitos", "warning");
    return;
  }

  // Validar nombres y apellidos
  if (nombres.trim().length < 3) {
    Swal.fire("Oops...", "El nombre es inválido", "warning");
    return;
  }
  if(apellidos.trim().length < 3){
    Swal.fire("Oops...", "El apellido es inválido", "warning");
    return;
  }

  if (documento.length === 0 && nombres.length === 0 && apellidos.length === 0 && telefono.length === 0 && correo.length === 0 && contraseña.length === 0) {
    Swal.fire("Oops...", "Todos los campos son obligatorios", "error");
    return;
  }

  if (/^\s*$/.test(nombres) || /^\s*$/.test(apellidos)) {
    Swal.fire(
      'No puede enviar campos en blanco',
      'Ops...',
      'warning'
    );
    return;
  }
  else{
    if (nombres.length == 0 || apellidos.length == 0) {

      if (nombre.length == 0) {
        Swal.fire(
          'El campo nombre es obligatorio',
          'Ops...',
          'warning'
        );
        return;
      }
      if (apellidos.length == 0) {
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

  // Validar la longitud del teléfono
  if (!regexTelefono.test(telefono) || telefono.length !== 10) {
    Swal.fire("Oops...", "El número de teléfono es inválido", "warning");
    return;
  }

  // Validar correo
  if (!regexCorreoElectronico.test(correo) || correo.length === 0) {
    Swal.fire("Oops...", "La dirección de correo electrónico es inválida.", "warning");
    return;
  }

  // Validar la longitud de la contraseña
  if (!regexContraseña.test(contraseña) || contraseña.length < 8) {
    Swal.fire("Oops...", "La contraseña debe ser mayor a 8 caracteres, contener al menos una mayúscula y al menos un número", "warning");
    return;
  }


  var selectElementOcupacion = document.getElementById("ocupaciones");
  var selectedIndexOcupacion = selectElementOcupacion.selectedIndex;

  var selectElementRol = document.getElementById("rol");
  var selectedIndexRol = selectElementRol.selectedIndex;

  if (selectedIndexRol === 0) {
    Swal.fire("Oops...", "Rol obligatorio", "warning");
    return;
  }

  var selectElementRol = document.getElementById("rol");
  var selectElementOcupacion = document.getElementById("ocupaciones");
  var seleccionado = selectElementRol.value;
  var seleccionado2 = selectElementOcupacion.value;

  if (seleccionado == "2" && seleccionado2 == "0") {
    Swal.fire("Oops...", "Servicio obligatorio", "warning");
    return;
  }

  var selectedTextOcupacion = selectElementOcupacion.options[selectedIndexOcupacion].textContent;
  var selectedTextRol = selectElementRol.options[selectedIndexRol].textContent;

  let rol, ocupacion, idServicio;

  if (selectedTextRol === "Admin") {
    rol = 1;
    idServicio = null
    ocupacion = null;
  } else {
    rol = 2;
    idServicio = selectedIndexOcupacion;
    ocupacion = selectedTextOcupacion;
  }


  verificarExistenciaDocumento(documento)
    .then(function (existeDocumento) {
      if (existeDocumento) {
        Swal.fire("Oops...", "Documento ya existente!", "error");
      } else {
        verificarExistenciaCorreo(correo)
          .then(function (existeCorreo) {
            if (existeCorreo) {
              Swal.fire("Oops...", "Correo ya existente!", "error");
            } else {
              var data = {
                docemp: documento,
                nomemp: nombres.trim(),
                apeemp: apellidos.trim(),
                telemp: telefono,
                coremp: correo,
                conemp: contraseña,
                estemp: 1,
                ocuemp: ocupacion,
                bloqueado: "Activo",
                id_servicio: idServicio,
                id_rol: rol,
              };

              guardarEmpleado(data)
                .then(function () {
                  var emailRequest = {
                    to: correo,
                    subject: "Registro empleado Stilo Chain WEB",
                    body: `Registro exitoso. ¡Bienvenido a la familia Stilo Chain WEB!\nRecuerda que debes entrar a la página con tu documento y contraseña\nDocumento: ${documento}\nContraseña: ${contraseña}`,
                  };

                  return enviarCorreo(emailRequest);
                })
                .then(limpiarCampos)
                .then(alerta)
                .catch(function (error) {
                  console.error("Error:", error);
                  Swal.fire(
                    "Error!",
                    "Hubo un error al guardar el empleado.",
                    "error"
                  );
                });
            }
          })
          .catch(function (error) {
            console.error("Error:", error);
            Swal.fire(
              "Error!",
              "Hubo un error al verificar el correo.",
              "error"
            );
          });
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      Swal.fire("Error!", "Hubo un error al verificar el documento.", "error");
    });
});


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

const guardarImagen = async (docemp) => {
  const fileInput = document.getElementById("imagen");
  const file = fileInput.files[0];

  if (file) {
    try {
      const base64Data = await redimensionarImagen(file, 400, 400);

      const response = await fetch(`http://localhost:8084/empleado/imagen/`, {
        method: "PUT",
        body: JSON.stringify({
          docemp: docemp,
          foto: base64Data,
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
    console.error("Error: No se ha seleccionado una imagen.");
  }
};

// --------- VALIDACIONES ----------

// Evita que se ingresen letras en un (input)

var documento = document.getElementById('documento');

// Agrega un oyente de eventos para el evento 'input'
documento.addEventListener('input', function () {
  // Elimina cualquier carácter que no sea un número o el carácter '-'
  this.value = this.value.replace(/[^0-9-]/g, '');
  this.value = this.value.replace(/[ ]/g, '');
});

// Evita que se ingresen letras y espacios en blanco en un (input)

var nombres = document.getElementById('nombres');

// Agrega un oyente de eventos para el evento 'input'
nombres.addEventListener('input', function () {
    // Elimina cualquier carácter que NO sea una letra en español (incluyendo espacios)
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
});

var apellidos = document.getElementById('apellidos');

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

var contraseña = document.getElementById('contraseña1');
var contraseña2 = documento.getElementById('contraseña2')

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