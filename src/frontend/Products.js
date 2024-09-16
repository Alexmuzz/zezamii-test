import React, { useState, useEffect } from "react";

function Products() {
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetch("https://dummyjson.com/products")
            .then((response) => response.json())
            .then((data) => setProducts(data.products))
            .catch((error) => console.error("Error fetching products:", error))
    }, [])

    // Filter products by title
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <h1>Product List</h1>
            <input
                type="text"
                placeholder="Search Products by Title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />
            <ul style={{ padding: "0", listStyleType: "none" }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <li
                            key={product.id}
                            style={{
                                border: "1px solid #ddd",
                                margin: "10px",
                                padding: "10px",
                                borderRadius: "8px",
                            }}
                        >
                            <h3>{product.title}</h3>
                            <p>
                                <strong>Price:</strong> ${product.price}
                            </p>
                            <p>{product.description}</p>

                            {/* Not in task description but looks nice with the image when rendered */}
                            {product.thumbnail && (
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    style={{ width: "100px", height: "auto" }}
                                />
                            )}
                        </li>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </ul>
        </div>
    );
}

export default Products;
