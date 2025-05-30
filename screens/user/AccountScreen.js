import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import Layout from '../../components/Layout';
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from '../../context/AuthContext';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase.config";

// Inicializa la instancia de Firestore
const db = getFirestore(firebaseApp);

const AccountScreen = ({ navigation }) => {
    // Obtiene el estado de autenticación y la función de logout
    const { authState, onLogout, userData } = useAuth();
    // Maneja el cierre de sesión
    const handleLogout = () => {
        onLogout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    // Navega a la pantalla para cambiar la contraseña
    const handleChangePassword = () => {
        navigation.navigate("ChangePassword");
    };

    // Muestra un indicador de carga mientras se obtienen los datos
    if (!userData) {
        return (
            <Layout>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0077B6" />
                </View>
            </Layout>
        );
    }

    return (
        <Layout>
            <View style={styles.container}>
                {/* Encabezado del perfil con avatar, nombre y rol */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {userData.nombre
                                ? userData.nombre
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "US"}
                        </Text>
                    </View>
                    <Text style={styles.title}>{userData.nombre || "Usuario"}</Text>
                    <Text style={styles.subtitle}>{userData.rol || "Rol"}</Text>
                </View>

                {/* Tarjeta con información personal */}
                <View style={styles.card}>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Información Personal</Text>

                        {/* Fila de email */}
                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="email"
                                size={20}
                                color="#4A6572"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>
                                {userData.correo || authState.user.email}
                            </Text>
                        </View>

                        {/* Fila de teléfono */}
                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="phone"
                                size={20}
                                color="#4A6572"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoLabel}>Teléfono:</Text>
                            <Text style={styles.infoValue}>{userData.telefono || "-"}</Text>
                        </View>
                        {/* Fila de dirección */}
                        <View style={styles.infoRow}>
                            <MaterialIcons
                                name="home"
                                size={20}
                                color="#4A6572"
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoLabel}>Dirección:</Text>
                            <Text style={styles.infoValue}>{userData.direccion || "-"}</Text>
                        </View>
                    </View>
                </View>

                {/* Sección de seguridad */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}> Seguridad</Text>
                    <View style={styles.infoRow}>
                        <MaterialIcons
                            name="lock"
                            size={20}
                            color="#4A6572"
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoLabel}>Clave de acceso:</Text>
                        <Text style={styles.infoValue}>***********</Text>
                        {/* Botón para cambiar la contraseña */}
                        <Pressable onPress={handleChangePassword}>
                            <Feather name="edit" size={20} color="#4A6572" />
                        </Pressable>
                    </View>
                    {/* ...otros campos de seguridad... */}
                </View>

                {/* Botón para cerrar sesión */}
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons
                        name="logout"
                        size={20}
                        color="#ffffff"
                        style={styles.logoutIcon}
                    />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </Pressable>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 25,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0077B6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#263238",
        marginVertical: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "#4A6572",
        marginBottom: 8,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    infoSection: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#263238",
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    infoIcon: {
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#4A6572",
        width: 75,
    },
    infoValue: {
        fontSize: 16,
        color: "#263238",
        flex: 1,
    },
    menuSection: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#0077B6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    menuText: {
        fontSize: 16,
        color: "#263238",
        fontWeight: "500",
        flex: 1,
    },
    menuArrow: {
        marginLeft: 8,
    },
    logoutButton: {
        backgroundColor: "#e74c3c",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: "auto",
        marginBottom: 25,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default AccountScreen;
