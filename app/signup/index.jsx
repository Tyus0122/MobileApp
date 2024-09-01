import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    Modal,
    ScrollView,
} from "react-native";
import { React, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhoneInput from "react-native-phone-input";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import { router, Link } from "expo-router";
export default function Index() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        dob: "",
        phno: "",
        password: "",
        phnocode:""
    });
    const [showPassword, setShowPassword] = useState(true);
    const [modalopen, setmodalopen] = useState(false);
    const [error, setError] = useState(true);
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    function validation() {
        console.log(formData)
    }
    function submitHandler() {
        axios
            .post(backend_url + "v1/user/signup", formData)
            .then((response) => {
                router.push("/login");
            })
            .catch((err) => {
                console.log(err);
                router.push("/login");
            });
    }
    return (
        <SafeAreaView>
            <ToastManager duration={3000} />
            <ScrollView keyboardShouldPersistTaps={"always"} keyboardDismissMode="on-drag">
                <View className="h-screen bg-blue-50">
                    <Pressable
                        className="mt-[30px] ml-[20px]"
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name={"arrow-back-outline"}
                            size={24}
                            color="gray"
                        />
                    </Pressable>
                    <View className=" pl-[15%] pr-[15%]">
                        <View className="items-center mt-[40px] mb-5">
                            <Text className="text-5xl font-extrabold mb-3">
                                Sign Up
                            </Text>
                            <Text className="text-lg text-gray-500">
                                Alread have an account?{" "}
                                <Link href={"/login"}>
                                    <Text className="text-blue-500">Login</Text>
                                </Link>
                            </Text>
                            {error && (
                                <View className="mt-4">
                                    <Text className="text-red-500 text-xl font-normal">
                                        wrong password
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">
                                Fullname
                            </Text>
                            <TextInput
                                className="bg-white mt-2 h-[50px] rounded-lg p-2 text-2xl"
                                onChangeText={(data) => {
                                    setFormData({
                                        ...formData,
                                        fullname: data,
                                    });
                                }}
                            />
                        </View>
                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">
                                Username
                            </Text>
                            <TextInput
                                className="bg-white mt-2 h-[50px] rounded-lg p-2 text-2xl"
                                onChangeText={(data) => {
                                    setFormData({
                                        ...formData,
                                        username: data,
                                    });
                                }}
                            />
                        </View>

                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">Phone</Text>
                            <View className='flex-row items-center gap-2'>
                                <View className="p-2 bg-white h-[50px] rounded-lg flex-row items-center w-[83px]">
                                    <Ionicons
                                        name={"chevron-down-outline"}
                                        size={8}
                                        color="gray"
                                    />
                                    <PhoneInput
                                        onChangePhoneNumber={(data) =>
                                            setFormData({
                                                ...formData,
                                                phnocode: data,
                                            })
                                        }
                                        initialCountry={"us"}
                                    />
                                </View>
                                <TextInput
                                    className="bg-white mt-2 h-[50px] rounded-lg p-2 text-2xl w-[72%] mb-2"
                                    onChangeText={(data) => {
                                        setFormData({
                                            ...formData,
                                            phno: data,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">Email</Text>
                            <TextInput
                                className="bg-white mt-2 h-[50px] rounded-lg p-2 text-2xl"
                                onChangeText={(data) => {
                                    setFormData({ ...formData, email: data });
                                }}
                            />
                        </View>
                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">
                                Birth of date
                            </Text>
                            <View className="relative">
                                <Pressable
                                    onPress={() => setmodalopen(!modalopen)}
                                >
                                    <TextInput
                                        placeholder={formData.dob}
                                        editable={false}
                                        className="bg-white mt-2 h-[50px]  rounded-lg p-2 text-2xl"
                                    />
                                    <Ionicons
                                        className="absolute right-2 top-2 mt-3"
                                        name={"calendar-outline"}
                                        size={24}
                                        color="gray"
                                    />
                                </Pressable>
                            </View>
                        </View>
                        {modalopen && (
                            <DateTimePicker
                                value={new Date()}
                                mode={"date"}
                                is24Hour={true}
                                onChange={(e, dates) => {
                                    setmodalopen(!modalopen);
                                    setFormData({
                                        ...formData,
                                        dob: formatDate(dates),
                                    });
                                }}
                            />
                        )}
                        <View className="mt-5">
                            <Text className="text-xl text-gray-500">
                                Set Password
                            </Text>
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
                                    onPress={togglePasswordVisibility}
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
                        <View className="mt-[50px]">
                            <Pressable
                                className="bg-blue-500 h-[50px] rounded-lg flex items-center justify-center"
                                onPress={validation}
                            >
                                <Text className="text-white text-2xl font-semibold">
                                    Register
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
