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
    const [showPassword, setShowPassword] = useState(true);
    const [buttonloading, setbuttonloading] = useState(false);
    const [password1,setPassword1]=useState("")
    const [password2,setPassword2]=useState("")
    function submitHandler() {
        setbuttonloading(!buttonloading);
        axios
            .post(backend_url + "v1/user/changePassword", { phno: params.phno,password:password1 })
            .then((response) => {
                setbuttonloading(!buttonloading);
                router.push('login')
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
                            New Password
                        </Text>
                        <Text className="text-xl mt-5 text-gray-500">
                            Create a new password. Ensure it differs from{"\n"}
                            previous ones for security
                        </Text>
                    </View>
                    <View className="flex-col justify-between h-[600px] m-5">
                        <View>
                            <View className="mt-5">
                                <Text className="text-xl text-gray-500">
                                    Enter new Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="bg-white mt-2 h-[50px]  rounded-lg p-2 text-2xl"
                                        secureTextEntry={showPassword}
                                        onChangeText={(data) => {setPassword1(data)}}
                                    />
                                    <Pressable
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-2 top-2 mt-3"
                                    >
                                        <Ionicons
                                            name={
                                                showPassword ? "eye-off" : "eye"
                                            }
                                            size={24}
                                            color="gray"
                                        />
                                    </Pressable>
                                </View>
                            </View>
                            <View className="mt-5">
                                <Text className="text-xl text-gray-500">
                                    Confirm new Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="bg-white mt-2 h-[50px]  rounded-lg p-2 text-2xl"
                                        secureTextEntry={showPassword}
                                        onChangeText={(data) => {setPassword2(data)}}
                                    />
                                    <Pressable
                                        onPress={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-2 top-2 mt-3"
                                    >
                                        <Ionicons
                                            name={
                                                showPassword ? "eye-off" : "eye"
                                            }
                                            size={24}
                                            color="gray"
                                        />
                                    </Pressable>
                                </View>
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
                                        change password
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
