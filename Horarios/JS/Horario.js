document.addEventListener("DOMContentLoaded", function () {
  function obtenerParametroDeConsulta(nombreParametro) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombreParametro);
  }

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Obtener la fecha actual
  const today = new Date();

  // Calcular la fecha límite (30 días a partir de hoy)
  const limitDate = new Date(today);
  limitDate.setDate(today.getDate() + 30);

  // Convertir la fecha límite al formato ISO para usar en el input de tipo "date"
  const limitDateString = limitDate.toISOString().split("T")[0];

  const datoRecibido = obtenerParametroDeConsulta("h2Text");
  const h2Id = localStorage.getItem("h2Id");

  if (datoRecibido) {
    fetch(
      "http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/ocupacion/" +
        decodeURIComponent(datoRecibido)
    )
      .then((res) => res.json())
      .then((res) => {
        let data = "";

        res.forEach((element) => {
          const estadoEmpleado = element.estemp;
          const estadoTexto =
            estadoEmpleado === 1
              ? "Activo"
              : estadoEmpleado === 2
              ? "Ocupado"
              : "Desconocido";
          const bloqueado = element.bloqueado
            ? element.bloqueado.toLowerCase()
            : "";

          // Definir el estilo para ocultar el elemento si está bloqueado
          const displayStyle =
            bloqueado === "bloqueado" ? "display: none;" : "";

          data += `
          <div class="service" style="${displayStyle}" data-docemp="${
            element.docemp
          }">
          <h1 class="TIT" id="${element.docemp}">${element.nomemp} ${
            element.apeemp
          }</h1>
          <img src="" class="imagen" alt="Empleado Image">
          <p class="TIT">${element.ocuemp}</p>
          <p class="TIT">Estado: ${estadoTexto}</p>
          <input type="date" name="" class="date fecha" id="date" placeholder="yyyy/mm/dd" min="${getCurrentDate()}" max="${limitDateString}" ${
            estadoEmpleado === 2 ? "disabled" : ""
          } onkeydown="return false;">

          <select id="hora" class="combo" ${
            estadoEmpleado === 2 ? "disabled" : ""
          }>
            <option value="" selected>Seleccione...</option>
          </select>
          <button class="btnReservar" ${
            estadoEmpleado === 2 ? "disabled" : ""
          }>Reservar</button>
        </div>
        
          `;

          // Obtener y mostrar la foto del empleado
          fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/obtener/" + element.docemp)
            .then((res) => {
              if (!res.ok) {
                // Si la respuesta no es exitosa, asigna la URL de la imagen predeterminada
                throw new Error("Error al obtener la imagen del empleado");
              }
              return res.blob();
            })
            .then((blob) => {
              const empleado = document.querySelector(
                `[data-docemp="${element.docemp}"]`
              );
              const imgElement = empleado.querySelector("img");
              const imageUrl = URL.createObjectURL(blob);
              imgElement.src = imageUrl;
            })
            .catch((error) => {
              console.error("Error al obtener la imagen del empleado:", error);

              // En caso de error, asigna la URL de la imagen predeterminada
              const empleado = document.querySelector(
                `[data-docemp="${element.docemp}"]`
              );
              const imgElement = empleado.querySelector("img");
              const imagenPredeterminada =
                "/IMG/imagenpredeterminada.jpg";
              imgElement.src = imagenPredeterminada;
            });
        });

        const services = document.getElementById("container__services");
        services.innerHTML = data;

        const inputs = document.querySelectorAll(".fecha");

        inputs.forEach(function (input) {
          input.addEventListener("change", function () {
            var divPadre = input.parentNode;
            var inputFecha = divPadre.querySelector("input[type=date]");
            var fechaSeleccionada = inputFecha.value;
            const empleado = input.closest(".service");
            const docEmp = empleado.querySelector("h1").id;

            fetch(`http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cita/${fechaSeleccionada}/${docEmp}`)
              .then((res) => res.json())
              .then((res) => {
                res.forEach((hora) => {
                  var select = empleado.querySelector("select");
                  var opciones = select.querySelectorAll("option");
                  opciones.forEach((element) => {
                    if (hora == element.textContent) {
                      element.style.display = "none";
                    }
                  });
                });
              });
          });
        });

        const reservar = document.querySelectorAll(".btnReservar");

        reservar.forEach((button) => {
          button.addEventListener("click", () => {
            const docClie = localStorage.getItem("documentocliente");
            const empleado = button.closest(".service");
            const docEmp = empleado.querySelector("h1").id;
            var fecha = empleado.querySelector("input").value;
            var selectHora = empleado.querySelector("select");
            var horaIndex = selectHora.selectedIndex;
            var horaText = selectHora.options[horaIndex].textContent;

            if (horaIndex === 0) {
              alert("Seleccione una hora antes de reservar.");
              return;
            }

            // Verificar si la fecha tiene día, mes y año
            const [year, month, day] = fecha.split("-");
            if (!year || !month || !day) {
              alert("Seleccione una fecha válida antes de reservar.");
              return;
            }

            procesarReserva(docClie, docEmp, fecha, horaText);
          });
        });

        // Llenar las horas en todos los recuadros de servicio
        llenarHoras();
      });
  } else {
    console.log("No se ha recibido ningún dato en la URL.");
  }

  function llenarHoras() {
    const servicio = h2Id;
    const serviceElements = document.querySelectorAll(".service");
    serviceElements.forEach((service) => {
      fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/hora/servi/" + servicio)
        .then((res) => res.json())
        .then((data) => {
          const selectHora = service.querySelector("select#hora");
          data.forEach((hora) => {
            const option = document.createElement("option");
            option.value = hora.id;
            option.textContent = hora.hora;
            selectHora.appendChild(option);
          });
        })
        .catch((error) => console.error("Error:", error));
    });
  }

  let docClie = localStorage.getItem("documentocliente");

  function procesarReserva(docClie, docEmp, fecha, horaText) {
    // Hacer la primera solicitud para verificar la disponibilidad de la cita
    fetch(`http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cita/${fecha}/${horaText}/${docEmp}`)
      .then((res) => res.json())
      .then((res) => {
        if (res === 1) {
          alert(
            `Seleccione otra hora. Esta hora ya está seleccionada para la fecha: ${fecha}`
          );
        } else {
          // Si la cita está disponible, guardar la reserva
          const reservaData = {
            docClixCit: docClie,
            horCita: horaText,
            fecCita: fecha,
            docEmpCita: docEmp,
          };

          fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cita/guardar", {
            method: "POST",
            body: JSON.stringify(reservaData),
            headers: {
              "Content-type": "application/json",
            },
          })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Reserva exitosa",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                localStorage.setItem("hora", horaText);
                localStorage.setItem("fecha", fecha);
                const docClie = localStorage.getItem("documentocliente");

                // Obtener el correo del cliente
                fetch(`http://localhost:8084/stilochain-0.0.1-SNAPSHOT/cliente/cliente/corcli/${docClie}`)
                  .then((res) => res.json())
                  .then((correoRes) => {
                    const correo = correoRes[0];
                    // Realizar el envío de correo
                    const emailRequest = {
                      to: correo,
                      subject: "Cita Stilo Chain WEB",
                      body: `Su cita se ha realizado con éxito. Recuerde que está agendada para el día ${fecha} y a la hora ${horaText}`,
                    };

                    fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/send-email", {
                      method: "POST",
                      body: JSON.stringify(emailRequest),
                      headers: {
                        "Content-type": "application/json",
                      },
                    })
                      .then(() => {
                        // Redirigir después del envío del correo
                        window.location.href = "Creditos.html";
                      })
                      .catch((error) => {
                        console.error("Error al enviar el correo:", error);
                        Swal.fire({
                          icon: "error",
                          title: "Error al enviar el correo",
                          text: "Ha ocurrido un error al intentar enviar el correo. Por favor, inténtalo nuevamente.",
                        });
                      });
                  })
                  .catch((error) => {
                    console.error(
                      "Error al obtener el correo del cliente:",
                      error
                    );
                    Swal.fire({
                      icon: "error",
                      title: "Error al obtener el correo del cliente",
                      text: "Ha ocurrido un error al intentar obtener el correo del cliente. Por favor, inténtalo nuevamente.",
                    });
                  });
              });
            })
            .catch((error) => {
              console.error("Error al guardar la reserva:", error);
              Swal.fire({
                icon: "error",
                title: "Error al guardar la reserva",
                text: "Ha ocurrido un error al intentar guardar la reserva. Por favor, inténtalo nuevamente.",
              });
            });
        }
      })
      .catch((error) => {
        console.error(
          "Error al verificar la disponibilidad de la cita:",
          error
        );
        Swal.fire({
          icon: "error",
          title: "Error al verificar la disponibilidad de la cita",
          text: "Ha ocurrido un error al intentar verificar la disponibilidad de la cita. Por favor, inténtalo nuevamente.",
        });
      });
  }
});
