import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Layout from '../../components/Layout';

const FormPay = () => {
    const route = useRoute();
    const { cartItems } = route.params || { cartItems: [] };

    const [form, setForm] = useState({
        nombre: '',
        telefono: '',
        correo: '',
        ciudad: '',
        barrio: '',
        direccion: '',
        metodoPago: 'contra_entrega'
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const renderItem = ({ item }) => {
        const total = item.price * item.quantity;
        return (
            <View style={styles.cartItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text>Cantidad: {item.quantity}</Text>
                <Text>Total: ${total}</Text>
            </View>
        );
    };

    const calcularTotalGeneral = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const renderForm = () => (
        <View style={styles.form}>
            <Text style={styles.sectionTitle}>Datos de envío</Text>
            <Text style={styles.sectionTitle2}>Solo se envía a Santander de Quilichao</Text>
            <TextInput style={styles.input} placeholder="Nombre completo" onChangeText={text => handleChange('nombre', text)} />
            <TextInput style={styles.input} placeholder="Teléfono" onChangeText={text => handleChange('telefono', text)} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Correo electrónico" onChangeText={text => handleChange('correo', text)} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Barrio" onChangeText={text => handleChange('barrio', text)} />
            <TextInput style={styles.input} placeholder="Dirección" onChangeText={text => handleChange('direccion', text)} />

            <Text style={styles.label}>Método de pago</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={form.metodoPago}
                    onValueChange={(itemValue) => handleChange('metodoPago', itemValue)}
                >
                    <Picker.Item label="Contra entrega" value="contra_entrega" />
                    <Picker.Item label="PSE" value="pse" />
                </Picker>
            </View>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Confirmar pedido</Text>
            </Pressable>
        </View>
    );

    return (
        <Layout>
            <FlatList
                ListHeaderComponent={
                    <View>
                        <Text style={styles.title}>Resumen</Text>
                    </View>
                }
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => item?.name ? item.name + index : index.toString()}
                ListFooterComponent={
                    <View>
                        <Text style={styles.total}>Total: ${calcularTotalGeneral()}</Text>
                        {renderForm()}
                    </View>
                }
                contentContainerStyle={styles.container}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        color: '#444'
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 15
    },
    cartItem: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f9f9f9'
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    form: {
        marginTop: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    sectionTitle2: {
        fontSize: 15,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginBottom: 15,
        overflow: 'hidden'
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default FormPay;
