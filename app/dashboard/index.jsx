import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    BackHandler,
} from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
    function handleBackPress() {
        BackHandler.exitApp();
        return true;
    }
    const [showPassword, setShowPassword] = useState(true);
    const [token, setToken] = useState(false);

    const [submit, setSubmit] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", handleBackPress);
            return () => {
                BackHandler.removeEventListener(
                    "hardwareBackPress",
                    handleBackPress
                );
            };
        })
    );
    useEffect(() => {
        async function fetchData() {
            const token = await AsyncStorage.getItem("BearerToken");
        }
        fetchData();
    }, []);

    async function removeToken() {
        await AsyncStorage.removeItem("BearerToken");
    }
    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <View className="h-screen flex items-center justify-center">
                    <Link href={'/temp'} className="border border-black-500 p-5 bg-blue-500 rounded-lg">
                        <Text className="text-white">temp</Text>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
