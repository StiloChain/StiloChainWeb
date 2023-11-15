const servicios = [];

fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/servicio")
    .then(res => res.json())
    .then(res => {
        servicios.push(...res);
        var select = document.getElementById("ocupaciones");
        servicios.forEach(element => {
            var option = document.createElement("option");
            option.value = element.id;
            option.text = element.nombre;
            select.appendChild(option);
        });
    });
