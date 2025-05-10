import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item, quantity) => {
        setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(p => p.name === item.name);
            if (existingIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingIndex].quantity += quantity; 
                return updatedItems;
            } else {
                // Si no existe, agregar el producto con la cantidad seleccionada
                return [...prevItems, { ...item, quantity }];
            }
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Función para manejar el logout
    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
