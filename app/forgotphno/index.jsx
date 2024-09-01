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
import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { useState, useEffect } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import PhoneInput from "react-native-phone-input";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ForgotPhno() {
    const [number, setNumber] = useState(0);
    const [buttonloading, setbuttonloading] = useState(false);
    function submitHandler() {
        setbuttonloading(!buttonloading);
        axios
            .post(backend_url + "v1/user/getOtp", { phno: number })
            .then((response) => {
                setbuttonloading(!buttonloading);
                router.push({
                    pathname: "/forgototp",
                    params: { phno: number },
                });
            })
            .catch((err) => {
                console.log(err);
                setbuttonloading(!buttonloading);
            });
    }

    return (
        <SafeAreaView>
            <ScrollView
                keyboardShouldPersistTaps={"always"}
                keyboardDismissMode="on-drag"
            >
                <View className="p-5 h-screen bg-blue-50">
                    <View className="flex-row items-center gap-4">
                        <Pressable onPress={() => router.back()}>
                            <Ionicons
                                name={"arrow-back-outline"}
                                size={24}
                                color="gray"
                            />
                        </Pressable>
                        <Text className="font-semibold text-2xl">
                            Forgot Password
                        </Text>
                    </View>
                    <View className="m-5">
                        <Text className="font-semibold text-4xl">
                            Enter email/phone No
                        </Text>
                        <Text className="text-xl mt-5 text-gray-500">
                            Enter your registered email/phone number
                        </Text>
                    </View>
                    <View className="flex-col justify-between h-[600px] m-5">
                        <View>
                            <Text className="text-gray-500">
                                Phone number/email
                            </Text>
                            <View className="p-2 mt-4 bg-white h-[50px] rounded-lg flex-row items-center">
                                <PhoneInput
                                    onChangePhoneNumber={(data) => {
                                        setNumber(data);
                                    }}
                                    initialCountry={"us"}
                                />
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                className="bg-blue-500 h-[50px] rounded-lg flex items-center justify-center"
                                onPress={submitHandler}
                                // disabled={buttonloading}
                            >
                                {buttonloading ? (
                                    <ActivityIndicator
                                        size={"large"}
                                        color={"white"}
                                    />
                                ) : (
                                    <Text className="text-white text-2xl font-semibold">
                                        sendOTP
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
