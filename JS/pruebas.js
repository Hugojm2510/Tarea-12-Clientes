function getParams() {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let params = {};
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}

document.querySelector("#api-form").addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener todos los productos
    fetch("http://localhost:8080/api/v1/product")
      .then((response) => {
        return response.json();
      })
      .then((products) => {
        mostrarProductos(products); // Mostrar los productos
      })
      .catch((error) => {
        console.error("Error", error);
      });
});

function agregar() {
    document.querySelector("#insertarElemento").addEventListener("submit" , (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe

      const productName = document.querySelector("#productName").value;
      const productPrice = document.querySelector("#productPrice").value;

      const productData = {productName, productPrice};

      fetch("http://localhost:8080/api/v1/product/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error: ${response.statusText}`
            );
          }

          console.log("Producto insertado");

          return fetch("http://localhost:8080/api/v1/product");
        })
        .then((response) => response.json())
        .then((products) => {
          mostrarProductos(products); // Mostrar los productos actualizados
        });
    });
}

function mostrarProductos(products) {
    const list = document.querySelector("#list");
    list.innerHTML = "<h1>Lista de Productos</h1>";
  
    const tabla = document.createElement("table");
    tabla.classList.add("tabla");
  
    const cabecera = document.createElement("tr");
    const cabeceras = ["ID", "Nombre", "Precio", "Acciones"];
    cabeceras.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      cabecera.appendChild(th);
    });
    tabla.appendChild(cabecera);
  
    products.forEach((product) => {
      const fila = document.createElement("tr");
  
      const id = document.createElement("td");
      id.textContent = product.productId;
      id.style.border = '1px solid black';
      fila.appendChild(id);
  
      const name = document.createElement("td");
      name.textContent = product.productName;
      name.style.border = '1px solid black';
      fila.appendChild(name);
  
      const price = document.createElement("td");
      price.textContent = product.productPrice;
      price.style.border = '1px solid black';
      fila.appendChild(price);
  
      const acciones = document.createElement("td");
  
      // Botón de editar
      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.onclick = () => editarProducto(product.productId); // Asociar la acción de editar al producto
      acciones.appendChild(botonEditar);
  
      // Botón de eliminar
      const botonBorrar = document.createElement("button");
      botonBorrar.textContent = "Eliminar";
      botonBorrar.onclick = () => borrar(product.productId); // Asociar la acción de eliminar al producto
      acciones.appendChild(botonBorrar);
  
      fila.appendChild(acciones);
      tabla.appendChild(fila);
    });
  
    list.appendChild(tabla);
}

agregar();


function editarProducto(productId) {

  fetch(`http://localhost:8080/api/v1/product/${productId}`)
    .then((product) => {
      document.querySelector("#productName").value = product.productName;
      document.querySelector("#productPrice").value = product.productPrice;

      document.querySelector("#insertarElemento").addEventListener("submit", (event) => {
        event.preventDefault();

        const actualizar = {
          productName: document.querySelector("#productName").value,
          productPrice: parseFloat(document.querySelector("#productPrice").value),
        };

        fetch(`http://localhost:8080/api/v1/product/edit/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actualizar),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el producto");
          }
          return response.json();
        })
        .then(() => {
          fetch("http://localhost:8080/api/v1/product")
            .then((response) => response.json())
            .then((products) => {
              mostrarProductos(products);
            });
        })
        .catch((error) => {
          console.error("Error al actualizar:", error);
        });
      })
    })
    .catch((error) => {
      console.error("Error al obtener el producto:", error);
    });
}

function borrar(productId) {
  fetch(`http://localhost:8080/api/v1/product/delete/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al borrar");
      }
      console.log(`eliminado correctamente.`);
    })
    .then(() => {
      return fetch("http://localhost:8080/api/v1/product");
    })
    .then((response) => response.json())
    .then((products) => {
      mostrarProductos(products); // Mostrar la lista actualizada
    })
    .catch((error) => {
      console.error("Error al eliminar:", error);
    });
}

