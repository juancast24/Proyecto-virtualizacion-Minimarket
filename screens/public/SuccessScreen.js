import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Pressable,
    Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SuccessScreen = () => {
    const navigation = useNavigation();
    const [progress] = useState(new Animated.Value(0));
    const [completed, setCompleted] = useState(false);
    const [scale] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 100,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start(() => {
            setCompleted(true);
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                tension: 120,
                useNativeDriver: true,
            }).start();
        });
    }, []);

    const progressWidth = progress.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.container}>
            {!completed ? (
                <>
                    <Text style={styles.title}>Procesando tu compra...</Text>
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                    </View>
                </>
            ) : (
                <>
                    <Animated.View style={[styles.iconWrapper, { transform: [{ scale }] }]}>
                        <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
                    </Animated.View>
                    <Text style={styles.title}>¡Compra exitosa!</Text>
                    <Text style={styles.subtitle}>
                        Tu pedido ha sido procesado correctamente.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: pressed ? "#388E3C" : "#4CAF50",
                                shadowOpacity: pressed ? 0.2 : 0.3,
                            },
                        ]}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Home" }],
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>Seguir comprando</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            {
                                backgroundColor: pressed ? "#0288D1" : "#03A9F4",
                                shadowOpacity: pressed ? 0.2 : 0.3,
                            },
                        ]}
                        onPress={() => navigation.navigate("ReciboScreen")}
                    >
                        <Text style={styles.buttonText}>Generar recibo</Text>
                    </Pressable>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    progressBarContainer: {
        width: "100%",
        height: 18,
        backgroundColor: "#E0E0E0",
        borderRadius: 50,
        overflow: "hidden",
        marginTop: 20,
    },
    progressBar: {
        height: 18,
        backgroundColor: "#4CAF50",
        borderRadius: 50,
    },
    iconWrapper: {
        marginBottom: 20,
    },
    button: {
        marginTop: 15,
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 25,
        width: "85%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
    },
});

export default SuccessScreen;
