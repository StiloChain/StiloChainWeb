const updateButton = document.getElementById("update");
updateButton.addEventListener("click", function () {
  var documento = document.getElementById("documento").value;
  var nombres = document.getElementById("nombres").value;
  var apellidos = document.getElementById("apellidos").value;
  var telefono = document.getElementById("telefono").value;
  var correo = document.getElementById("correo").value;
  var contraseña = document.getElementById("contraseña").value;
  var selectElementRol = document.getElementById("rol");
  var selectElementOcupacion = document.getElementById("ocupaciones");

  function enviarCorreo(emailRequest) {
    fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/send-email", {
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

  const regexTelefono = /^3[0-9]{9}$/;
  const regexCorreoElectronico = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (nombres.length === 0 && apellidos.length === 0 && telefono.length === 0 && correo.length === 0 && contraseña.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Todos los campos son obligatorios',
    });
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
  else {
    if (nombres.length == 0 || apellidos.length == 0) {

      if (nombres.length == 0) {
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
  if (nombres.trim().length < 3) {
    Swal.fire("Oops...", "El nombre es inválido", "warning");
    return;
  }
  if (apellidos.trim().length < 3) {
    Swal.fire("Oops...", "El apellido es inválido", "warning");
    return;
  }


  if (regexTelefono.test(telefono)) {
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'El número de teléfono es inválido',
    });
    return;
  }

  if (regexCorreoElectronico.test(correo)) {
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'La dirección de correo electrónico es inválida',
    });
    return;
  }



  if (!contraseña.match(contrasenaRegex) || contraseña.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'La contraseña debe ser mayor a 7 caracteres, contener al menos una mayúscula y al menos un número',
    });
    return;
  }



  var selectElementRol = document.getElementById("rol");
  var selectElementOcupacion = document.getElementById("ocupaciones");
  var selectedValueRol = selectElementRol.value;

  if (selectedValueRol === "0") {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Rol obligatorio',
    });
    return;
  }

  if (selectedValueRol !== "1" && !selectElementOcupacion.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Ocupación obligatoria',
    });
    return;
  }

  var selectedValueRol = selectElementRol.value;
  let rol, ocupacion, idServicio;

  if (selectedValueRol === "1") {
    rol = 1;
    idServicio = null;
    ocupacion = null;
  } else {
    rol = 2;
    idServicio = selectElementOcupacion.value; // Usar el valor
    ocupacion = selectElementOcupacion.options[selectElementOcupacion.selectedIndex].textContent; // Obtener el texto de la opción
  }

  const datosActualizados = {
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

  fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/empleado/coremp/" + documento)
    .then((res) => res.json())
    .then((empleadoData) => {
      const correoEmpleado = empleadoData[0]
      if (correo !== correoEmpleado) {
        fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/correo/" + correo)
          .then((res) => res.json())
          .then((existeCorreo) => {
            if (existeCorreo) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Correo ya existente!',
              });
            } else {
              fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + documento, {
                method: "PUT",
                body: JSON.stringify(datosActualizados),
                headers: {
                  "Content-Type": "application/json",
                }
              })
                .then((response) => response.json())
                .then((data) => {
                  actualizarImagen(data.docemp, base64Image);
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Empleado actualizado con éxito',
                    showConfirmButton: false,
                    timer: 1500
                  });

                  const emailRequest = {
                    to: correo,
                    subject: "Actualización exitosa en Stilo Chain WEB",
                    body: `Actualización exitosa. ¡Tus datos han sido actualizados!\nRecuerda que debes entrar a la página con tu documento y contraseña\nDocumento: ${documento}\nContraseña: ${contraseña}`,
                  };

                  enviarCorreo(emailRequest);

                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                })
                .catch((error) => {
                  console.error("Error en la solicitud de actualización: " + error);
                });
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {
        const datosActualizados2 = {
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
        fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + documento, {
          method: "PUT",
          body: JSON.stringify(datosActualizados2),
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then((response) => response.json())
          .then((data) => {
            actualizarImagen(data.docemp, base64Image);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Empleado actualizado con éxito',
              showConfirmButton: false,
              timer: 1500
            });

            const emailRequest = {
              to: correo,
              subject: "Actualización exitosa en Stilo Chain WEB",
              body: `Actualización exitoso. ¡Tus datos han sido actualizados!\nRecuerda que debes entrar a la página con tu documento y contraseña\nDocumento: ${documento}\nContraseña: ${contraseña}`,
            };

            enviarCorreo(emailRequest);

            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch((error) => {
            console.error("Error en la solicitud de actualización: " + error);
          });
      }
    });
});


function limpiarCampos() {
  document.getElementById("documento").value = "";
  document.getElementById("nombres").value = "";
  document.getElementById("apellidos").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("contraseña").value = "";
}

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

let base64Image;

function convertirImagenABase64() {
  const inputImagen = document.getElementById('imagen');

  if (inputImagen.files && inputImagen.files[0]) {
    const file = inputImagen.files[0];
    redimensionarImagen(file, 800, 600) // Cambia maxWidth y maxHeight según tus necesidades
      .then((resizedBase64) => {
        base64Image = resizedBase64;
      })
  }
}

document.getElementById('imagen').addEventListener('change', convertirImagenABase64);

function actualizarImagen(docemp, nuevaImagen) {
  fetch('http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/imagen', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      docemp: docemp,
      foto: nuevaImagen,
    }),
  })
    .then((response) => {
      if (response.ok) {
      }
    })
}


// ---------- VALIDACIONES ----------

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

var contraseña = document.getElementById('contraseña');


// Agrega un oyente de eventos para el evento 'input'
contraseña.addEventListener('input', function () {
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

