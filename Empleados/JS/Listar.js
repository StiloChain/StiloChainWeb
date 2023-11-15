let recordsPerPage = 3;
let body = document.getElementById("tbody");
let prevButton = document.getElementById("prevPage");
let nextButton = document.getElementById("nextPage");
let currentPageElement = document.getElementById("currentPage");
let currentPage = 1;

var documento = document.getElementById("documento");
var nombres = document.getElementById("nombres");
var apellidos = document.getElementById("apellidos");
var telefono = document.getElementById("telefono");
var correo = document.getElementById("correo");
var contraseña = document.getElementById("contraseña");
var rol = document.getElementById("rol");
var ocupaciones = document.getElementById("ocupaciones");

fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado")
  .then((res) => res.json())
  .then((res) => {
    const allRecords = res;

    function showRecords(page) {
      const startIndex = (page - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      const recordsToDisplay = allRecords.slice(startIndex, endIndex);

      let data = "";
      recordsToDisplay.forEach((element) => {
        data += `
          <tr>
            <td>${element.docemp}</td>
            <td>${element.nomemp}</td>
            <td>${element.apeemp}</td>
            <td>${element.ocuemp}</td>
            <td>${element.bloqueado}</td>
            <td>
              <button class="editarBtn">Editar</button>
              <button class="eliminar">Bloquear/Activar Empleado</button>
            </td>
          </tr>
        `;
      });
      body.innerHTML = data;

      currentPage = page;
      totalPages = Math.ceil(res.length / recordsPerPage);
      currentPageElement.textContent = `Página actual: ${page} / ${totalPages}`;
    }

    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const currentPageElement = document.getElementById("currentPage");

    let currentPage = 1;
    showRecords(currentPage);

    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        showRecords(currentPage - 1);
      }
    });

    nextButton.addEventListener("click", () => {
      const startIndex = currentPage * recordsPerPage;
      if (startIndex < allRecords.length) {
        showRecords(currentPage + 1);
      }
    });

    rol.addEventListener("change", function () {
      var selectedValue = parseInt(rol.value);

      if (selectedValue === 1) {
        ocupaciones.disabled = true;
        ocupaciones.value = "";
      } else if (selectedValue === 2) {
        ocupaciones.disabled = false;
        ocupaciones.value = "";
      }
    });

    var tabla = document.getElementById("table");

    tabla.addEventListener("click", function (event) {
      if (event.target.classList.contains("editarBtn")) {
        var fila = event.target.closest("tr");
        var primeraCelda = fila.querySelector("td:first-child");
        var valorPrimeraCelda = primeraCelda.textContent;
    
        fetch("http://localhost:8084/empleado/" + valorPrimeraCelda)
          .then((res) => res.json())
          .then((res) => {
            documento.value = res["docemp"];
            nombres.value = res["nomemp"];
            apellidos.value = res["apeemp"];
            telefono.value = res["telemp"];
            correo.value = res["coremp"];
            contraseña.value = res["conemp"];
    
            const imgElement = $("#imagen1");
            const docemp = res["docemp"]; // Reemplaza con el campo correcto del documento del empleado
            const imageUrl = "http://localhost:8084/empleado/obtener/" + docemp;
            imgElement.attr("src", imageUrl);
    
            $("#convertirBase64").off("click").on("click", function () {
              if (imgElement.attr("src")) {
                const base64Data = getBase64FromImage(imgElement, id);
              } else {
                console.log("No se mostró ninguna imagen.");
              }
            });
    
            // Establece la URL de la imagen para el campo 'imagen1'
            document.getElementById("imagen1").src = imageUrl;
    
            var estado = res["id_rol"];
            for (var i = 0; i < rol.options.length; i++) {
              if (parseInt(rol.options[i].value) === estado) {
                rol.selectedIndex = i;
                break;
              }
            }
    
            var servicio = res["ocuemp"];
            fetch("http://localhost:8084/servicio")
              .then((res) => res.json())
              .then((servicios) => {
                ocupaciones.innerHTML = '';
    
                servicios.forEach((element) => {
                  var option = document.createElement("option");
                  option.value = element.id;
                  option.text = element.nombre;
                  ocupaciones.appendChild(option);
    
                  if (element.nombre === servicio) {
                    option.selected = true;
                  }
                });
    
                if (estado === 1) {
                  ocupaciones.disabled = true;
                } else if (estado === 2) {
                  ocupaciones.disabled = false;
                }
              });
          });
    }
    


      if (event.target.classList.contains("eliminar")) {
        var fila = event.target.closest("tr");

        var primeraCelda = fila.querySelector("td:first-child");
        var cuartaCelda = fila.querySelector("td:nth-child(4");

        var valorPrimeraCelda = primeraCelda.textContent.trim();
        var valorCuartaCelda = cuartaCelda.textContent.trim();

        const nuevoEstado = valorCuartaCelda === "Bloqueado" ? "Activo" : "Bloqueado";

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: "¿Estás seguro?",
            text: `Cambiar estado a: ${nuevoEstado}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `¡Sí, cambiar a ${nuevoEstado}!`,
            cancelButtonText: "¡No, cancelar!",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              fetch("http://localhost:8084/empleado/bloquear/" + valorPrimeraCelda, {
                method: "PUT",
                body: JSON.stringify({
                  docemp: valorPrimeraCelda,
                  bloqueado: nuevoEstado,
                }),
                headers: {
                  "Content-type": "application/json",
                },
              });

              swalWithBootstrapButtons.fire(
                "Estado cambiado!",
                `El empleado ahora está ${nuevoEstado}.`,
                "success"
              );

              location.reload();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                "Cancelado",
                "La operación ha sido cancelada.",
                "error"
              );
            }
          });
      }
    });
  });
