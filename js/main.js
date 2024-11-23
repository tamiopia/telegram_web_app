let productos = []; // Products array

fetch("./js/productos.json") // Fetch products from JSON file
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos); // Load products
    });

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Close aside menu on category button click
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = ""; // Clear container

    productosElegidos.forEach(producto => {
        // Create product elements
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Add</button>
            </div>
        `;
        contenedorProductos.append(div); // Append to container
    });

    actualizarBotonesAgregar(); // Update "Add" buttons
}

// Filter products by category
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre; // Update title
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton); // Load filtered products
        } else {
            tituloPrincipal.innerText = "All Products"; // Show all products
            cargarProductos(productos);
        }
    });
});

// Update "Add to Cart" buttons
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito); // Add click event
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito"); // Get cart from localStorage

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS); // Parse cart
    actualizarNumerito(); // Update cart count
} else {
    productosEnCarrito = [];
}

// Add product to cart
function agregarAlCarrito(e) {
    Toastify({
        text: "Product added", // Toast message
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
        },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id; // Get clicked button ID
    const productoAgregado = productos.find(producto => producto.id === idBoton); // Find product

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++; // Increase quantity
    } else {
        productoAgregado.cantidad = 1; // Set quantity to 1
        productosEnCarrito.push(productoAgregado); // Add to cart
    }

    actualizarNumerito(); // Update cart count

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Save cart to localStorage
}

// Update cart count
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito; // Update number in UI
}
