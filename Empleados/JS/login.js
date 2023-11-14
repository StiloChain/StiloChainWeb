const btn = document.getElementById("btnLogin");

btn.addEventListener("click", function () {
    var Documento = document.getElementById("Documento").value;
    var password = document.getElementById("password").value;

    fetch("http://localhost:8084/empleado/" + Documento)
        .then(res => res.json())
        .then(res => {
            if (res) {
                if (res.conemp === password) {
                    if (res.bloqueado === "Bloqueado") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Empleado bloqueado',
                            text: 'No puedes acceder porque el empleado está bloqueado.',
                        });
                    } else if (res.id_rol === 1) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Acceso denegado',
                            text: 'No tienes permisos para acceder.',
                        });
                    } else {
                        window.open("VisualizarReservas.html", "_blank");
                        setTimeout(function () {
                            window.open('about:blank', '_self').close();
                          }, 2);
                        const documentoEmpleado = Documento;
                        localStorage.setItem("documentoEmpleado", documentoEmpleado);
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: 'Documento o Contraseña incorrecta!',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: 'Empleado no encontrado. Verifica el número de documento.',
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: 'Ocurrió un error al procesar la solicitud.',
            });
        });
});