var documento = document.getElementById("documento");
var correo = document.getElementById("email");

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

function recuperarContra() {
    const numeroDocumento = documento.value;
    const emailCliente = correo.value;
  
    fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cliente/" + numeroDocumento)
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al obtener los datos del cliente');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          if (data.corCli === emailCliente && data.docCli === numeroDocumento) {
            alert('El correo electrónico y el número de documento coinciden con el cliente.');
  
            // Preparar la solicitud para enviar el correo
            var emailRequest = {
              to: emailCliente,
              subject: "Recuperación de contraseña Stilo Chain WEB",
              body: `Su contraseña es ${data.conCli}`
            };
  
            // Enviar el correo electrónico
            enviarCorreo(emailRequest);
          } else {
            alert('El correo electrónico o el número de documento no coinciden con el cliente.');
          }
        } else {
          alert('No se encontró ningún cliente con el número de documento ingresado.');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }

function volver() {
    window.location.href = "../../Clientes/HTML/IniciarSesion.html";
}
