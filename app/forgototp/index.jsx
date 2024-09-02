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
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ForgotOtp() {
    const params = useLocalSearchParams();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);
    const [error, setError] = useState(false);
    const [errorValue, setErrorVlaue] = useState("");
    const [buttonloading, setbuttonloading] = useState(false);
    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Automatically focus the next input if the current one is filled
        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // If the user presses backspace and the current box is empty, focus the previous one
        if (
            e.nativeEvent.key === "Backspace" &&
            otp[index] === "" &&
            index > 0
        ) {
            inputs.current[index - 1].focus();
        }
    };
    const submitHandler = () => {
        setbuttonloading(true);
        axios
            .post(backend_url + "v1/user/postOtp", {
                phno: params.phno,
                otp: otp.join(""),
            })
            .then((response) => {
                setbuttonloading(false);
                router.push({
                    pathname: "resetpassword",
                    params: { phno: params.phno },
                });
            })
            .catch((err) => {
                if (err.status === 420) {
                    setError(true)
                    setErrorVlaue("Enter Valid OTP")
                }
                setbuttonloading(false);
            });
    };
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
                            Verification
                        </Text>
                    </View>
                    <View className="flex-col justify-between h-[600px] m-5">
                        <View>
                            <Text className="text-gray-500 text-xl">
                                Enter the OTP code we just sent{"\n"}
                                you on your registered Email/Phone number
                            </Text>
                            <View className="p-2 mt-[60px] flex-row items-center gap-2">
                                {otp.map((digit, index) => (
                                    <TextInput
                                        className={`bg-white mt-2 h-[50px] w-[50px] rounded-lg p-2 text-2xl ${(error ? 'border border-red-500' : "")}`}
                                        key={index}
                                        ref={(input) =>
                                            (inputs.current[index] = input)
                                        }
                                        value={digit}
                                        onChangeText={(text) =>
                                            handleChange(text, index)
                                        }
                                        onKeyPress={(e) =>
                                            handleKeyPress(e, index)
                                        }
                                        keyboardType="numeric"
                                        maxLength={1}
                                        textAlign="center"
                                    />
                                ))}
                            </View>
                            {
                                error && (
                                    <Text className="mt-5 text-red-500 text-sm">
                                        {errorValue}
                                    </Text>
                                )
                            }
                            <Text className="mt-5">
                                Didn't get OTP?{" "}
                                <Text className="text-blue-500">
                                    Resend OTP
                                </Text>
                            </Text>
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
                                        Next
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
