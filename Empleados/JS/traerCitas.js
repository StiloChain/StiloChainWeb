document.addEventListener("DOMContentLoaded", function () {
  const docCliente = localStorage.getItem("documentocliente");
  const tbody = document.getElementById("citasTable").getElementsByTagName("tbody")[0];
  let citasData = [];

  const dataTable = $('#citasTable').DataTable({
    data: [],
    columns: [
      { data: 'codCit' },
      { data: 'docClixCit' },
      { data: 'horCita' },
      { data: 'fecCita' },
      { data: 'docEmpCita' }
    ],
    paging: true,
    pageLength: 5,
    lengthChange: false,
    searching: false,
    language: {
      "decimal": "",
      "emptyTable": "No hay datos disponibles",
      "info": "Total de resultados _TOTAL_",
      "infoEmpty": "Mostrando 0 a 0 de 0 resultados",
      "infoFiltered": "(filtrado de _MAX_ resultados totales)",
      "infoPostFix": "",
      "thousands": ",",
      "lengthMenu": "Mostrar _MENU_ entraresultadosdas",
      "loadingRecords": "Cargando...",
      "processing": "Procesando...",
      "search": "Buscar:",
      "zeroRecords": "No se encontraron registros",
      "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
      },
      "aria": {
        "sortAscending": ": activar para ordenar la columna ascendentemente",
        "sortDescending": ": activar para ordenar la columna descendentemente"
      }
    }
  });

  // Obtener datos del empleado
  fetch("http://localhost:8084/empleado/" + documentoEmpleado)
    .then(response => response.json())
    .then(empleadoData => {
      // Verifica si se encontró el empleado
      if (!empleadoData) {
        console.error('No se encontró un empleado con el documento proporcionado.');
        return;
      }

      const empleado = {
        documento: empleadoData.docemp,
      };

      // Obtener datos de las citas
      fetch("http://localhost:8084/cita")
        .then((res) => res.json())
        .then((res) => {
          citasData = res.filter(cita => cita.docEmpCita === documentoEmpleado); // Filtrar citas para el empleado
          populateTable(citasData);

          // Agregar los datos a la tabla DataTables
          dataTable.clear().rows.add(citasData).draw();
        })
        .catch(error => console.error('Error al obtener las citas:', error));
    })
    .catch(error => console.error('Error al obtener los datos del empleado:', error));

  // Agregar event listener para filtrar el campo de la fecha
  const fechaInput = document.getElementById("fecha");
  fechaInput.addEventListener("input", () => {
    const fechaFiltro = fechaInput.value.toLowerCase();
    const citasFiltradas = citasData.filter((cita) =>
      cita.fecCita.toLowerCase().includes(fechaFiltro)
    );
    populateTable(citasFiltradas);

    // Cada vez que filtra se actualiza la tabla
    dataTable.clear().rows.add(citasFiltradas).draw();
  });

  // Agregar event listener para filtrar el campo del documento
  const documentoInput = document.getElementById("documento");
  documentoInput.addEventListener("input", () => {
    const documentoFiltro = documentoInput.value.toLowerCase();
    const citasFiltradas = citasData.filter((cita) =>
      cita.docClixCit.toLowerCase().includes(documentoFiltro)
    );
    populateTable(citasFiltradas);

    // Cada vez que filtra se actualiza la tabla
    dataTable.clear().rows.add(citasFiltradas).draw();
  });

  // Función para llenar la tabla con datos
  function populateTable(data) {
    // Limpiar la tabla
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    // Llenar la tabla con los datos filtrados
    data.forEach((element) => {
      const newRow = tbody.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4);
      cell1.textContent = element["codCit"];
      cell2.textContent = element["docClixCit"];
      cell3.textContent = element["horCita"];
      cell4.textContent = element["fecCita"];
      cell5.textContent = element["docEmpCita"];
    });
  }
});
