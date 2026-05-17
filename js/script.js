let cantidadProductos = 0;
let totalAcumulado = 0;

let contadorCarrito = document.getElementById("contador-carrito");
let listaCarrito = document.getElementById("lista-carrito");
let totalProductos = document.getElementById("total");
let botonVaciar = document.getElementById("btn-vaciar");
let mensajeVacio = document.getElementById("mensaje-vacio");

// ======= LOCALSTORAGE =======

function guardarCarrito(nombre, precio) {
  if (!nombre || !precio) return;
  let carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoGuardado.push({ nombre, precio });
  localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
}

function eliminarDelStorage(nombre, precio) {
  let carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
  let index = carritoGuardado.findIndex(item => item.nombre === nombre && item.precio === precio);
  if (index !== -1) carritoGuardado.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
}

function limpiarStorage() {
  localStorage.removeItem("carrito");
}

function cargarCarritoGuardado() {
  let carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoGuardado.forEach(item => {
    if (!item.nombre || !item.precio) return; // ignora items inválidos
    agregarItemAlDOM(item.nombre, item.precio);
    totalAcumulado += item.precio;
    cantidadProductos++;
  });

  if (cantidadProductos > 0) {
    mensajeVacio.style.display = "none";
    updateTotal();
    updateBadge();
  }
}

// ======= FUNCIONES =======

function updateBadge() {
  if (contadorCarrito) contadorCarrito.textContent = cantidadProductos;
}

function updateTotal() {
  totalProductos.textContent = "$" + totalAcumulado.toLocaleString();
}

function agregarItemAlDOM(nombre, precio) {
  let nuevoItem = document.createElement("li");
  nuevoItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
  nuevoItem.textContent = nombre + " - $" + precio.toLocaleString();

  let botonEliminar = document.createElement("button");
  botonEliminar.textContent = "X";
  botonEliminar.classList.add("btn", "btn-sm");

  botonEliminar.addEventListener("click", () => {
    eliminarItem(nuevoItem, precio, nombre);
  });

  nuevoItem.appendChild(botonEliminar);
  listaCarrito.appendChild(nuevoItem);
}

// ======= EVENTO GLOBAL =======
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-agregar")) {
    let precio = Number(e.target.dataset.precio);
    let nombre = e.target.dataset.nombre;

    if (!nombre || !precio) return;

    totalAcumulado += precio;
    cantidadProductos++;
    mensajeVacio.style.display = "none";

    guardarCarrito(nombre, precio);
    agregarItemAlDOM(nombre, precio);
    updateTotal();
    updateBadge();
    //Notificaciones
    Toastify({
      text: `✈️ ${nombre} agregado al carrito`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "var(--color-primario)",
        borderRadius: "25px",
        fontFamily: "Ubuntu, sans-serif",
        fontSize: "0.9rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }
    }).showToast();
  }
});

function eliminarItem(li, precio, nombre) {
  li.remove();
  totalAcumulado -= precio;
  cantidadProductos--;

  eliminarDelStorage(nombre, precio);

  if (cantidadProductos === 0) {
    mensajeVacio.style.display = "block";
  }

  updateTotal();
  updateBadge();
}

// ======= VACIAR =======
botonVaciar.addEventListener("click", () => {
  listaCarrito.innerHTML = "";
  totalAcumulado = 0;
  cantidadProductos = 0;
  mensajeVacio.style.display = "block";
  limpiarStorage();
  updateTotal();
  updateBadge();
});

// ======= CARGAR AL INICIAR =======
cargarCarritoGuardado();

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btn-news");
  const input = document.getElementById("input-news");

  btn.addEventListener("click", function () {
    const email = input.value;


    if (email === "" || !email.includes("@")) {
      alert("Por favor, ingresa un correo electrónico válido.");
    } else {
      alert("¡Gracias por suscribirte! Pronto recibirás ofertas en: " + email);

      input.value = "";
    }
  });
});
// ======= BUSCADOR =======
const formBuscar = document.querySelector('form[role="search"]');
const inputBuscar = document.querySelector('form[role="search"] input');

formBuscar.addEventListener("submit", function (e) {
  e.preventDefault();
  const termino = inputBuscar.value.trim().toLowerCase();
  if (!termino) return;

  const tarjetas = document.querySelectorAll(".card");
  let encontrado = false;

  tarjetas.forEach(card => {
    const titulo = card.querySelector(".card-title");
    if (titulo && titulo.textContent.toLowerCase().includes(termino)) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      encontrado = true;
    }
  });

  if (!encontrado) {
    Toastify({
      text: `No se encontró "${inputBuscar.value}"`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "#dc3545",
        borderRadius: "25px",
        fontFamily: "Ubuntu, sans-serif",
        fontSize: "0.9rem"
      }
    }).showToast();
  }

  inputBuscar.value = "";
});

