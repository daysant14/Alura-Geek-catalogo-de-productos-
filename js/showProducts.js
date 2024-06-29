import { conexionAPI } from "./conexionAPI.js";

const lista = document.querySelector("[data-lista]");

function crearCard(NameProduct, Price, Image, id) {
    const product = document.createElement("div");
    product.className = "product-content";
    product.dataset.id = id; // Agrega el identificador del producto
    console.log("Image URL:", Image);
    product.innerHTML = `
        <div class="content">
            <img class="img" src="${Image}" alt="Imagen del producto">
            <h3>${NameProduct}</h3>
            <div class="bottom-content">
                <div class="price"><i class='bx bx-money-withdraw' style='color:#f8a813'></i>${Price}</div>
                <div class="btn-boxp">
                    <button type="button" class="btn delete-btn"><i class='bx bxs-trash'></i></button>
                </div>
            </div>
        </div>`;

    // Agrega el controlador de eventos para el botón de eliminar
    const deleteBtn = product.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async function() {
        await eliminarProducto(id, product);
    });

    return product; // Devuelve el elemento creado
}

async function eliminarProducto(id, productElement) {
    try {
        await conexionAPI.eliminarProduct(id); // Llama a la API para eliminar el producto del servidor
        productElement.remove(); // Elimina el elemento del DOM
        console.log(`Producto con ID ${id} eliminado`);
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${id}:`, error);
    }
}

async function listarProductos() {
    try {
        const listaAPI = await conexionAPI.listarProducts();
        listaAPI.forEach(product => {
            const card = crearCard(product.NameProduct, product.Price, product.Image, product.id);
            document.querySelector(".product-row").appendChild(card); // Añade el producto al contenedor
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Manejo del formulario de agregar producto
document.querySelector(".product-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Previene la recarga de la página

    const name = document.querySelector("#product-name").value;
    const price = document.querySelector("#product-price").value;
    const imageFile = document.querySelector("#product-image").files[0];

    const reader = new FileReader();
    reader.onloadend = async () => {
        const imageUrl = reader.result;
        const newProduct = {
            NameProduct: name,
            Price: price,
            Image: imageUrl
        };
        try {
            const addedProduct = await conexionAPI.agregarProduct(newProduct);
            const card = crearCard(addedProduct.NameProduct, addedProduct.Price, addedProduct.Image, addedProduct.id);
            document.querySelector(".product-row").appendChild(card); // Añade el nuevo producto al contenedor
            document.querySelector(".product-form").reset(); // Resetea el formulario
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
});

document.querySelector(".btn-clear").addEventListener("click", (event) => {
    event.preventDefault(); // Previene la recarga en caso de que el botón esté en un formulario
    document.querySelector(".product-form").reset();
});

listarProductos();


