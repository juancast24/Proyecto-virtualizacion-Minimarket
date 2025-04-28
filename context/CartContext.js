import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para manejar el login

    const { onLogout } = useAuth();

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
    const logout = () => {
        setIsLoggedIn(false); // Cambia el estado de login
        setCartItems([]); // Limpia el carrito (opcional)
        onLogout(); // Llama a la función onLogout de AuthContext para limpiar la autenticación
        console.log('Sesión cerrada correctamente');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart, isLoggedIn, setIsLoggedIn, logout  }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
