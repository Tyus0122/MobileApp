import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    BackHandler,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import PhoneInput from "react-native-phone-input";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Resetpassword() {
    const params = useLocalSearchParams();
    async function logoutHandler() {
        await AsyncStorage.removeItem("BearerToken")
        router.push("/")
    }

    return (
        <SafeAreaView>
            <ScrollView
                keyboardShouldPersistTaps={"always"}
                keyboardDismissMode="on-drag"
            >
                <View className="h-screen flex items-center justify-center">
                    <Pressable
                        className="bg-blue-500 p-5 w-[40%] flex items-center justify-center rounded-xl"
                        onPress={logoutHandler}
                    >
                        <Text className="text-white font-semibold text-2xl">
                            logout
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
