$(document).ready(function () {
  const recordsPerPage = 3;
  let currentPage = 1;
  let totalPages;

  const tableBody = $("#tableBody");
  const prevPageButton = $("#prevPage");
  const nextPageButton = $("#nextPage");
  const currentPageElement = $("#currentPage");
  const totalPagesElement = $("#totalPages");

  const read = (page) => {
    $.ajax({
      url: "http://localhost:8084/servicio",
      type: "GET",
      dataType: "json",
      success: function (res) {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const recordsToDisplay = res.slice(startIndex, endIndex);

        tableBody.empty();

        recordsToDisplay.forEach((element) => {
          const row = `
            <tr>
              <td>${element.nombre}</td>
              <td>${element.precio}</td>
              <td>${element.duracion}</td>
              <td>
                <button class="buttonAct" id_servicio="${element.id}">Editar</button>
              </td>
            </tr>
          `;
          tableBody.append(row);
          tableBody.find('.buttonAct').on('click', completarCampos);
        });

        totalPages = Math.ceil(res.length / recordsPerPage);
        totalPagesElement.text(`Total de páginas: ${totalPages}`);

        currentPage = page;
        currentPageElement.text(`Página actual: ${currentPage} / ${totalPages}`);

        if (currentPage === 1) {
          prevPageButton.prop("disabled", true);
        } else {
          prevPageButton.prop("disabled", false);
        }

        if (recordsToDisplay.length < recordsPerPage || endIndex >= res.length) {
          nextPageButton.prop("disabled", true);
        } else {
          nextPageButton.prop("disabled", false);
        }
      },
      error: function (error) {
        console.error("Error en la solicitud de lectura: " + error);
      }
    });
  };

  prevPageButton.click(() => {
    if (currentPage > 1) {
      read(currentPage - 1);
    }
  });

  nextPageButton.click(() => {
    if (currentPage < totalPages) {
      read(currentPage + 1);
    }
  });

  read(currentPage);
});



const completarCampos = function () {
  const btnFields = $(this);
  const id = btnFields.attr("id_servicio");

  $.ajax({
    url: "http://localhost:8084/servicio/" + id,
    type: "GET",
    dataType: "json",
    success: function (res) {
      $("#id").val(res.id);
      $("#nombre").val(res.nombre);
      $("#precio").val(res.precio);
      $("#duracion").val(res.duracion);

      const imgElement = $("#imagen");
      const imageUrl = "http://localhost:8084/servicio/obtener/" + id;
      imgElement.attr("src", imageUrl);

      $("#convertirBase64").off("click").on("click", function () {
        if (imgElement.attr("src")) {
          const base64Data = getBase64FromImage(imgElement, id);
        } else {
          console.log("No se mostró ninguna imagen.");
        }
      });
    },
    error: function (error) {
      console.error("Error en la solicitud de completar campos: " + error);
    }
  });
};

const update = () => {
  $("#btnActualizar").on("click", function () {
    let id = $("#id").val();
    const nombre = $("#nombre").val();
    const precio = $("#precio").val();
    const duracion = $("#duracion").val();


    if (nombre.length === 0 && precio.length === 0 && duracion.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "¡Todos los campos son obligatorios!",
      });
      return;
    }

    if (/^\s*$/.test(nombre)) {
      Swal.fire(
          'No puede enviar campos en blanco',
          'Ops...',
          'warning'
      );
      return;
  } else {
      if (nombre.trim() === "") {
          Swal.fire({
              title: 'Oops',
              text: "El campo de nombre no puede estar vacío.",
              icon: 'warning',
          });
          return
      }
  }
    if (precio.length === 0){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "¡El campo nombre es obligatorio!",
      });
      return;
    }

    if (duracion.length === 0){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "¡El campo nombre es obligatorio!",
      });
      return;
    }

    // Validación de precio entre 8000 y 1000000
    const precioNum = parseInt(precio);
    if (precioNum < 8000 || precioNum > 1000000) {
      Swal.fire({
        icon: "warning",
        title: "ERROR",
        text: "¡El precio debe estar entre 8,000 y 1,000,000!",
      });
      return; 
    }

    // Validación de duración entre 10 y 300 minutos
    const duracionNum = parseInt(duracion);
    if (duracionNum < 10 || duracionNum > 300) {
      Swal.fire({
        icon: "warning",
        title: "ERROR",
        text: "¡La duración debe estar entre 10 y 300 minutos!",
      });
      return; // Si la duración no cumple la condición, no se actualiza.
    }

    // El resto del código de actualización se mantiene igual.
    const datosServicio = {
      id: id,
      nombre: nombre.trim(),
      precio: precio.trim(),
      duracion: duracion.trim(),
      imagen_url: guardarImagen(id),
    };

    deletePreviousHours(id);

    fetch("http://localhost:8084/servicio/" + id)
      .then((res) => res.json())
      .then((servicioExistente) => {
        if (nombre === servicioExistente.nombre) {
          $.ajax({
            url: "http://localhost:8084/servicio/" + id,
            contentType: "application/json",
            type: "PUT",
            data: JSON.stringify(datosServicio),
            success: (data) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Servicio actualizado con éxito',
                showConfirmButton: false,
                timer: 1500
              });
              saveHours(id);
              limpiarCampos();
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            error: function (error) {
              console.error("Error en la solicitud de actualización: " + error);
            },
          });
        } else {
          fetch("http://localhost:8084/servicio/nombre/" + nombre.trim())
            .then((res) => res.json())
            .then((existeNombre) => {
              if (existeNombre > 0) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Nombre ya existente en la base de datos!',
                });
              } else {
                $.ajax({
                  url: "http://localhost:8084/servicio/" + id,
                  contentType: "application/json",
                  type: "PUT",
                  data: JSON.stringify(datosServicio),
                  success: (data) => {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Servicio actualizado con éxito',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    saveHours(id);
                    limpiarCampos();
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500
                    )
                  },
                  error: function (error) {
                    console.error("Error en la solicitud de actualización: " + error);
                  },
                });
              }
            });
        }
      });
  });
};


const deletePreviousHours = (id) => {
  $.ajax({
    url: "http://localhost:8084/hora/delete/" + id,
    type: "DELETE",
    dataType: "json",
    success: () => {
    },
    error: function (error) {
      console.error("Error en la solicitud de eliminación de horas:", error);
    }
  });
};

const saveHours = (id) => {
  const formatTime12Hour = (hour, minutes) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  let txtDuracion = $("#duracion").val();
  let tiempo = parseInt(txtDuracion);
  let horaInicio = new Date();
  horaInicio.setHours(8, 0, 0, 0); // 08:00 AM
  let horaFin = new Date();
  horaFin.setHours(20, 0, 0, 0); // 08:00 PM
  let horaActual = new Date(horaInicio);

  let order = 1;

  while (horaActual <= horaFin) {
    let hora = horaActual.getHours();
    let minutos = horaActual.getMinutes();
    let minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
    let horaFormateada = formatTime12Hour(hora, minutosFormateados);

    const horaData = {
      idservi: id,
      hora: horaFormateada,
      orden: order,
    };

    fetch("http://localhost:8084/hora/guardar", {
      method: "POST",
      body: JSON.stringify(horaData),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Hora enviada al servidor con éxito:", data);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });

    horaActual.setMinutes(horaActual.getMinutes() + tiempo);
    order++;
  }
};

const borrar = function () {
  const btnFields = $(this);
  const id = btnFields.attr("id_servicio");

  if (confirm("¿Estás seguro de borrar este servicio?")) {
    $.ajax({
      url: "http://localhost:8084/servicio/" + id,
      type: "DELETE",
      dataType: "json",
      success: (res) => {
      },
      error: function (error) {
        console.error("Error en la solicitud de eliminación de servicio: " + error);
      }
    });
  }
};

const guardarImagen = (idServicio) => {
  const fileInput = document.getElementById("nuevaImagen");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const base64Data = e.target.result; // Elimina el prefijo "data:image/jpeg;base64,"

      subirImagen(idServicio, base64Data);
    };

    reader.readAsDataURL(file);
  } else {
    console.error("No se ha seleccionado ninguna imagen.");
  }
};

const subirImagen = (idServicio, base64Data) => {
  fetch(`http://localhost:8084/servicio/imagen/`, {
    method: "PUT",
    body: JSON.stringify({
      id: idServicio,
      imagen: base64Data,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Imagen subida exitosamente.");
      } else {
        console.error("Error al subir la imagen.");
      }
    })
    .catch((error) => {
      console.error("Ocurrió un error inesperado:", error);
    });
};



function limpiarCampos() {
  document.getElementById("id").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("duracion").value = "";
  document.getElementById("nuevaImagen").value = null;
}
update();

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