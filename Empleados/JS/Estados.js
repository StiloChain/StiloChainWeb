const estados = [];

fetch("http://localhost:8084/stilochain-0.0.1-SNAPSHOT/estado")
    .then(res => res.json())
    .then(res => {
        // Agrega los datos de la respuesta al arreglo 'array'
        estados.push(...res);
        // Luego, crea y agrega las opciones al elemento select
        var select = document.getElementById("estados");
        estados.forEach(element => {
            var option = document.createElement("option");
            option.value = element.id;
            option.text = element.nombre;
            select.appendChild(option);
        });
    });
