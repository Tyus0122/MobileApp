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
export default function Temp() {
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
                    <Pressable
                        className="border border-black-500 p-5 bg-blue-500 rounded-lg m-5"
                        onPress={removeToken}
                    >
                        <Text className="text-white">Remove</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
