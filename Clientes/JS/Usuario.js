const btnGuardar = document.getElementById("btnGuardar");

btnGuardar.addEventListener("click", function () {
  validarCampos();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.blur();
  });
});

function validarCampos() {
  let documento = document.getElementById("documento").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  let telefono = document.getElementById("telefono").value;
  let email = document.getElementById("correo").value;
  let password1 = document.getElementById("contraseña1").value;
  let password2 = document.getElementById("contraseña2").value;

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.blur();
  });

  const regexCedulaColombiana = /^\d{7,10}$/
  const regexTelefono = /^3[0-9]{9}$/;
  const regexCorreoElectronico = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const contrasenaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (documento.length == 0 && nombre.length == 0 && apellido.length == 0 && telefono.length == 0 && email.length == 0 &&
    password1.length == 0 && password2.length == 0) {
    Swal.fire(
      'Todos los campos son obligatorios',
      'Oops...',
      'error'
    );
    return;
  }

  if (regexCedulaColombiana.test(documento)) {
  } else {
    Swal.fire(
      'Documento inválido',
      'Ops...',
      'warning'
    );
    return;
  }

  if (/^\s*$/.test(nombre) || /^\s*$/.test(apellido)) {
    Swal.fire(
      'No puede enviar campos en blanco',
      'Ops...',
      'warning'
    );
    return;
  }
  else{
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

    // Validar nombres y apellidos
    if (nombre.trim().length < 3) {
      Swal.fire("Oops...", "El nombre es inválido", "warning");
      return;
    }
    if(apellido.trim().length < 3){
      Swal.fire("Oops...", "El apellido es inválido", "warning");
      return;
    }

  if (regexTelefono.test(telefono)) {
  } else {
    Swal.fire(
      'El número de teléfono es inválido',
      'Ops...',
      'warning'
    );
    return;
  }

  if (regexCorreoElectronico.test(email)) {
  } else {
    Swal.fire(
      'La dirección de correo electrónico es inválida.',
      'Ops...',
      'warning'
    );
    return;
  }

  if (!password1.match(contrasenaRegex) || password1.length === 0) {
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'La contraseña debe ser mayor a 7 caracteres, contener al menos una mayúscula y al menos un número',
    });
    return;
}

  if (password1 === password2) {
  } else {
    Swal.fire(
      'Las contraseñas no coinciden.',
      'Ops...',
      'warning'
    );
    return;
  }

  let terminosCheckbox = document.getElementById("terminos");
  let privacidadCheckbox = document.getElementById("privacidad");

  let password1Input = document.getElementById("contraseña1");
  let password2Input = document.getElementById("contraseña2");

  if (!terminosCheckbox.checked || !privacidadCheckbox.checked) {
    password1Input.readOnly = true;
    password2Input.readOnly = true;
  } else {
    password1Input.readOnly = false;
    password2Input.readOnly = false;
  }

  if (!terminosCheckbox.checked || !privacidadCheckbox.checked) {
    Swal.fire(
      'Debes aceptar los términos y condiciones y la política de privacidad.',
      'Ops...',
      'warning'
    );
    return; 
  }

// Validar el documento
fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cliente/" + documento)
  .then(res => res.json())
  .then(res => {
    if (res !== null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Documento ya existente!'
      });
    } else {
      // El documento no existe, puedes proceder a validar el correo
      fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cliente/correo/" + email)
        .then(res => res.json())
        .then(correoExistente => {
          if (correoExistente && correoExistente >= 1) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Correo ya existente!'
            });
          } else {
            // El documento y el correo no existen, puedes proceder con el guardado
            fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cliente/guardar", {
              method: "POST",
              body: JSON.stringify({
                "docCli": documento,
                "conCli": password1,
                "nomCli": nombre.trim(),
                "apeCli": apellido.trim(),
                "telCli": telefono,
                "corCli": email
              }),
              headers: {
                "Content-type": "application/json",
              }
            })
              .then(() => {
                var inputs = document.querySelectorAll('input');
                inputs.forEach(function (campo) {
                  campo.value = "";
                });
                terminosCheckbox.checked = false;
                privacidadCheckbox.checked = false;
                Swal.fire(
                  'Guardado!',
                  '',
                  'success'
                );
              })
              .then(enviarCorreo(emailRequest));
          }
        });
    }
  });

  var emailRequest = {
    to: email,
    subject: "Registro Stilo Chain WEB",
    body: `Registro exitoso. ¡Bienvenido a Stilo Chain WEB!\nRecuerda que debes entrar a la página con tu documento y contraseña\nDocumento: ${documento}\nContraseña: ${password1}`
  };
}

function enviarCorreo(emailRequest) {
  fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/send-email", {
    method: "POST",
    body: JSON.stringify(emailRequest),
    headers: {
      "Content-type": "application/json",
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }
      return response.json();
    })
    .then(function (data) {
      alert("Correo enviado exitosamente");
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

const eye1 = document.getElementById("eye1");

eye1.addEventListener("click", function () {
  const passwordInput1 = document.getElementById("contraseña1");
  const passwordInput2 = document.getElementById("contraseña2");
  if (passwordInput1.type == "password") {
    passwordInput1.type = "text";
    passwordInput2.type = "text";
  } else {
    passwordInput1.type = "password";
    passwordInput2.type = "password";
  }
});


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
