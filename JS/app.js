/*
 sirve para extraer los valores de los parámetros que se encuentran en la URL después de enviar el formulario
 con el método GET. Cuando envías un formulario GET, los datos se agregan a la URL como una cadena de
 consulta (query string). La función getParams() permite convertir esa cadena en un objeto JavaScript,
 facilitando el acceso a cada parámetro por su nombre:

http://tu-sitio.com/otrapagina?baseUrl=http://localhost:8080
                                                            &getAllEndpoint=/baseUrl/v1/products/
                                                            &insertEndpoint=/baseUrl/v1/products/insert/
                                                            &editEndpoint=/baseUrl/v1/products/edit/{id}
                                                            &deleteEndpoint=/baseUrl/v1/products/delete/{id}

{
    baseUrl: "http://localhost:8080",
    getAllEndpoint: "/baseUrl/v1/products/",
    insertEndpoint: "/baseUrl/v1/products/insert/",
    editEndpoint: "/baseUrl/v1/products/edit/{id}",
    deleteEndpoint: "/baseUrl/v1/products/delete/{id}"
}

*/

function getParams() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var params = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}


document.querySelector("#api-form").addEventListener("click", (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/api/v1/product")
    .then((products) => {
        showAllProducts(products);
    });
});


function insertProduct() {
    document.querySelector("#insertForm").addEventListener("submit", function(event) {
        event.preventDefault();
    
        const name = document.querySelector("#name").value;
        const price = document.querySelector("#price").value;
    
        fetch("http://localhost:8080/api/v1/product/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, price})
        })
    
        .then(response => response.json())
        .then(products => {
            showAllProducts(products);
        })
    
        .catch(error => console.error("Error al insertar el elemento; ", error));
    
    });
}
    

function createTable(products) {
    const table = document.createElement("table");
    const filaCabecera = document.createElement("tr");

    /*
    el Object.keys(data[0]), va a tomar la clave del primer elemento array
    por cada elemento crea un header y agrega esa fila al filaCabecera
    y filaCabecera se agrega a la tabla. 
    */

    // crea la fila cabecera y le mete el valor de la clave
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement("th");
        th.textContent = key;
        filaCabecera.appendChild(th);
    });

    // agrega encabezados
    const thAcciones = document.createElement("th");
    thAcciones.textContent = "Acciones";
    filaCabecera.appendChild(thAcciones);
    table.appendChild(filaCabecera);

    // crear las filas con los datos
    data.forEach(item => {
        const row = document.createElement("tr");

        Object.values(items).forEach(value => {
            const tr = document.createElement("tr");
            tr.textContent = value;
            row.appendChild(tr);
        });

        // boton de editar
        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.onclick = () => editarItem(params, item);

        // boton de borrar
        const botonBorrar = document.createElement("button");
        botonBorrar.textContent = "Borrar";
        botonBorrar.onclick = () => borrarItem(params, item);

        /*
        vamos a agregar una celda a la fila de la tabla que contiene
        los botones de accion, editar y eliminar. 
        */
        const celdasAccion = document.createElement("td");
        celdasAccion.appendChild(botonEditar);
        celdasAccion.appendChild(botonBorrar);
        
        row.appendChild(row);
    });

    document.querySelector('#tablecontainer').appendChild(table);
}







// 


function editarItem(params, item) {
    const editUrl = `${params.baseUrl}${params.editEndpoint.replace("{id}", item.id)}`;

    window.location.href = `edit.html?editUrl=${encodeURIComponent(editUrl)}`;
}

function borrarItem(params, id, row) {
    fetch(`${params.baseUrl}${params.deleteEndpoint.replace("{id}", id)}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            row.remove();
            console.log("Borrado");
        } else {
            console.error("Error al borrar");
        }
    });
}









// function cargarDatos() {
    //     const params = getParams();
    
    //     console.log(params);
    
    //     fetch(`${params.baseUrl}${params.getAll}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         console.log(data, params);
    //     })
    //     .catch(error => console.error("error al obtener los datos ", error));
    // }
    