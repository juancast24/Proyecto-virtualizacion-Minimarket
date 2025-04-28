import AsyncStorage from '@react-native-async-storage/async-storage';
export let products = [];


// Función para cargar los productos desde AsyncStorage
export const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      products = storedProducts ? JSON.parse(storedProducts) : [];
      console.log('Productos cargados:', products);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  // Función para guardar los productos en AsyncStorage
const saveProducts = async () => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(products));
      console.log('Productos guardados.');
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  };

  export const updateProduct = async (name, updatedProduct) => {
    const updatedProducts = products.filter((product) => {
        if (product.name === name) {
            return { ...product, ...updatedProduct }; // Actualiza el producto encontrado
        }
        return product; // Mantén los demás productos sin cambios
    });

    if (JSON.stringify(products) === JSON.stringify(updatedProducts)) {
        throw new Error(`Producto con nombre "${name}" no encontrado.`);
    }

    products = updatedProducts; // Actualiza la lista global de productos
    await saveProducts(); // Guarda los productos actualizados
    console.log(`Producto actualizado: ${name}`);
};

// Función para agregar un nuevo producto
export const addProduct = async (product) => {
    products.push(product);
    await saveProducts(); // Guarda los productos actualizados
    console.log('Producto agregado:', product);
  };

// Función para eliminar un producto
export const deleteProduct = async (name) => {
    products = products.filter((product) => product.name !== name);
    await saveProducts(); // Guarda los productos actualizados
    console.log(`Producto eliminado: ${name}`);
  };