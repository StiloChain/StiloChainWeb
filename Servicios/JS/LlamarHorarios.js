const btn = document.getElementById("btnReservar");
var variable = [];

btn.addEventListener("click", function () {
    var Servicio = document.getElementById("Servicio").value;
    fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/empleado/" + Servicio)
        .then(res => res.json())
        .then(res => {
            variable.push(res.ocuemp);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});




