// Conexión a la API
async function listarProducts() {
    const response = await fetch("http://localhost:3003/Products");
    const products = await response.json();
    return products;
}

async function agregarProduct(product) {
    const response = await fetch("http://localhost:3003/Products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
    const newProduct = await response.json();
    return newProduct;
}

async function eliminarProduct(id) {
    const response = await fetch(`http://localhost:3003/Products/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(`Error al eliminar el producto con ID ${id}`);
    }
}

export const conexionAPI = {
    listarProducts,
    agregarProduct,
    eliminarProduct
};
