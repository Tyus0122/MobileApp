import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
    const [isShowContent, setIsShowContent] = useState(true);
    // useEffect(() => {
    //     async function fetchData() {
    //         const token = await AsyncStorage.getItem("BearerToken");
    //         const headers = {
    //             authorization: "Bearer " + token,
    //             "content-type": "application/json",
    //         };
    //         axios
    //             .get(backend_url + "v1/user/login", {headers})
    //             .then((response) => {
    //                 console.log('apicallsent')
    //                 setIsShowContent(true)
    //             })
    //             .catch((err) => {
    //                 router.push("/dashboard");
    //             });
    //     }
    //     fetchData();
    // },[]);
    const [showPassword, setShowPassword] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    function submitHandler() {
        setSubmit(true);
        axios
            .post(backend_url + "v1/user/loginSubmit", formData)
            .then((response) => {
                AsyncStorage.setItem("BearerToken", response.data.BearerToken);
                router.push("/dashboard");
            })
            .catch((err) => {
                console.log(err.status);
            });
    }
    return isShowContent ? (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <View className="h-screen bg-blue-50 p-[15%]">
                    <View className="items-center mt-[40px] mb-5">
                        <Image
                            source={require("@/assets/tyuss/loginLogo.jpg")}
                            className="w-[32px] h-[32px]"
                        />
                    </View>
                    <View className="mt-5 mb-5">
                        <Text className="text-5xl font-extrabold mb-2">
                            Sign in to your
                        </Text>
                        <Text className="text-5xl font-extrabold mb-2">
                            Account
                        </Text>
                        <Text className="mb-2 text-lg text-gray-500">
                            Enter your email and password to log in
                        </Text>
                    </View>
                    <View className="mt-5">
                        <Text className="text-xl text-gray-500">Email</Text>
                        <TextInput
                            className="bg-white mt-2 h-[50px] rounded-lg p-2 text-2xl"
                            onChangeText={(data) => {
                                setFormData({
                                    ...formData,
                                    email: data,
                                });
                            }}
                        />
                    </View>
                    <View className="mt-5">
                        <Text className="text-xl text-gray-500">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-white mt-2 h-[50px]  rounded-lg p-2 text-2xl"
                                secureTextEntry={showPassword}
                                onChangeText={(data) => {
                                    setFormData({
                                        ...formData,
                                        password: data,
                                    });
                                }}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2 mt-3"
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View className="mt-5 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Pressable onPress={() => setIsChecked(!isChecked)}>
                                <Ionicons
                                    name={
                                        isChecked
                                            ? "checkbox-outline"
                                            : "square-outline"
                                    }
                                    size={24}
                                    color="gray"
                                />
                            </Pressable>
                            <Text className="text-xl text-gray-500">
                                Remember me
                            </Text>
                        </View>
                        <View>
                            <Text className="text-xl text-blue-500">
                                Forgot Password ?
                            </Text>
                        </View>
                    </View>
                    <View className="mt-5">
                        <Pressable
                            className="bg-blue-500 h-[50px] rounded-lg flex-row items-center justify-center"
                            onPress={submitHandler}
                        >
                            {submit ? (
                                <ActivityIndicator
                                    size={"large"}
                                    color={"white"}
                                />
                            ) : (
                                <Text className="text-white text-2xl font-semibold">
                                    Log in
                                </Text>
                            )}
                        </Pressable>
                    </View>
                    <View className="mt-5 flex-row items-center justify-between">
                        <View className="border border-gray-300 w-[45%]"></View>
                        <Text>Or</Text>
                        <View className="border border-gray-300 w-[45%]"></View>
                    </View>
                    <View className="mt-5">
                        <Pressable className="bg-white h-[50px] rounded-lg flex-row items-center justify-center gap-3">
                            <Ionicons name={"logo-google"} size={20} />
                            <Text className="text-black-500 text-2xl font-semibold">
                                Continue with Google
                            </Text>
                        </Pressable>
                    </View>
                    <View className="mt-5 flex-row justify-center">
                        <Text className="text-xl text-gray-500">
                            Not Registered Yet?{" "}
                            <Link href={"/signup"}>
                                <Text className="text-blue-500">Sign Up</Text>
                            </Link>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    ) : (
        <SafeAreaView>
            <View className="h-screen flex items-center justify-center">
                <ActivityIndicator size={"large"} color={"blue"} />
                <Text className="mt-3 ml-4 text-xl font-semibold">
                    Loading ...
                </Text>
            </View>
        </SafeAreaView>
    );
}
