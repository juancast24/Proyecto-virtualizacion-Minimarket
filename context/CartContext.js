import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebase.config';
import { useAuth } from './AuthContext';

const db = getFirestore(firebaseApp);

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(null); 
    const [loading, setLoading] = useState(true);
    const { authState } = useAuth();

    // Guardar carrito en Firestore
    const saveCartToFirestore = async (items) => {
        if (authState.authenticated && authState.user) {
            const uid = authState.user.uid;
            await setDoc(doc(db, 'carritos', uid), { items });
        }
    };

    // Leer carrito desde Firestore
    const loadCartFromFirestore = async () => {
        setLoading(true);
        if (authState.authenticated && authState.user) {
            const uid = authState.user.uid;
            const docSnap = await getDoc(doc(db, 'carritos', uid));
            if (docSnap.exists()) {
                setCartItems(docSnap.data().items || []);
            } else {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
        setLoading(false);
    };

    // Cargar el carrito cuando el usuario se autentica
    useEffect(() => {
        if (authState.authenticated) {
            loadCartFromFirestore();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [authState.authenticated]);

    // Guardar el carrito en Firestore cada vez que cambia
    useEffect(() => {
        if (authState.authenticated && cartItems !== null) {
            saveCartToFirestore(cartItems);
        }
    }, [cartItems]);

    // Agregar un producto al carrito
    const addToCart = (item, quantity) => {
        setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(p => p.name === item.name);
            if (existingIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingIndex].quantity += quantity;
                return updatedItems;
            } else {
                return [...prevItems, { ...item, quantity }];
            }
        });
    };

    // Vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    // Actualizar la cantidad de un producto en el carrito
    const updateItemQuantity = (itemName, quantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item => 
                item.name === itemName ? { ...item, quantity } : item
            );
        });
    };

    // Eliminar un producto del carrito
    const removeItemFromCart = (itemName) => {
        setCartItems(prevItems => {
            return prevItems.filter(item => item.name !== itemName);
        });
    };

    // Proveer el contexto a los hijos
    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart, loading, updateItemQuantity, removeItemFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
