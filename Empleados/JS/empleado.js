const radioActivo = document.getElementById('radio-activo');
const radioOcupado = document.getElementById('radio-ocupado');

const documentoEmpleado = localStorage.getItem("documentoEmpleado");


fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + documentoEmpleado)
    .then(response => response.json())
    .then(empleado => {
        if (empleado.estemp === 1) {
            radioActivo.checked = true;
        } else if (empleado.estemp === 2) {
            radioOcupado.checked = true;
        }
    })
    .catch(error => {
        console.error('Error en la solicitud AJAX:', error);
    });

radioActivo.addEventListener('change', () => {
    actualizarEstado(1);
});

radioOcupado.addEventListener('change', () => {
    actualizarEstado(2);
});

function actualizarEstado(nuevoEstado) {
  const documentoEmpleado = localStorage.getItem("documentoEmpleado", "documentoemple");

    
    fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + documentoEmpleado)
        .then(response => response.json())
        .then(empleado => {
            const data = {
                docemp: documentoEmpleado,
                nomemp: empleado.nomemp,
                apeemp: empleado.apeemp,
                telemp: empleado.telemp,
                coremp: empleado.coremp,
                conemp: empleado.conemp,
                estemp: nuevoEstado,
                ocuemp: empleado.ocuemp,
                bloqueado: "Activo",
                id_servicio: empleado.id_servicio,
                id_rol: empleado.id_rol,
            };

            return fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + documentoEmpleado, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        })
    .then(response => {
        if (response.ok) {
            console.log('Estado actualizado exitosamente');
        } else {
            console.error('Error al actualizar el estado');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud AJAX:', error);
    });

    




}
