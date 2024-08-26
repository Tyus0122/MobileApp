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
    const showToast = () => {
        Toast.error("Promised is resolved");
    };
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        dob: "",
        phno: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [modalopen, setmodalopen] = useState(false);
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    function submitHandler() {
        axios
            .post(backend_url + "v1/user/signup", formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <SafeAreaView>
            <ToastManager duration={3000} />
            <ScrollView keyboardShouldPersistTaps={'always'}>
                <View className="h-screen bg-blue-50">
                    <Pressable className="mt-[30px] ml-[20px]" onPress={()=>router.back()}>
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
                            <View className="p-2 bg-white h-[50px] rounded-lg flex-row items-center">
                                <PhoneInput
                                    onChangePhoneNumber={(data) =>
                                        setFormData({ ...formData, phno: data })
                                    }
                                    initialCountry={"us"}
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
                                onPress={submitHandler}
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
