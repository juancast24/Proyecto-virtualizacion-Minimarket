import {createContext, useContext} from 'react';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc } from 'firebase/firestore';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const db = getFirestore();

export const PedidosContext = createContext();

export const usePedidos = () => {
  return useContext(PedidosContext);
};

export const PedidosProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const {authState} = useAuth();
    const {cartItems} = useCart();

    const savePedidoToFirestore = async (product) => {
        if (authState.authenticated && authState.user) {
            const uid = authState.user.uid;
            await setDoc(doc(db, 'pedidos', uid), { items: [product] });
        }
    };

    const addToPedidos= async (form,cartItems) => {
        await setDoc(doc(db, 'pedidos', form.uid), {
            items: cartItems,
        });
    }

    return (
        <PedidosContext.Provider value={{ products, setProducts, savePedidoToFirestore, addToPedidos }}>
            {children}
        </PedidosContext.Provider>
    );
};