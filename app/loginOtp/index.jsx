import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	Platform,
	KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef, useContext } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import { SocketContext } from "@/app/_layout.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotOtp() {
	const params = useLocalSearchParams();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const inputs = useRef([]);
	const [error, setError] = useState(false);
	const [errorValue, setErrorVlaue] = useState("");
	const [buttonloading, setbuttonloading] = useState(false);
	const { socket, setSocket } = useContext(SocketContext);
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
		if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
			inputs.current[index - 1].focus();
		}
	};

	const submitHandler = () => {
		setbuttonloading(true);
		setError(false);
		axios
			.post(backend_url + "v1/user/verifyOtp", {
				phno: params.phno,
				otp: otp.join(""),
			})
			.then((response) => {
				setbuttonloading(false);
				// AsyncStorage.setItem("BearerToken", response.data.BearerToken);
				// socket.emit("registerTheToken", { token: response.data.BearerToken });
				router.push("/main");
			})
			.catch((err) => {
				if (err.status === 420) {
					setError(true);
					setErrorVlaue("Enter Valid OTP");
				}
				setbuttonloading(false);
			});
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				keyboardShouldPersistTaps="always"
				keyboardDismissMode="on-drag"
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
					style={{ flex: 1 }}
				>
					<View className="p-5 flex-1 bg-blue-50">
						<View className="flex-row items-center gap-4">
							<Pressable onPress={() => router.back()}>
								<Ionicons name={"arrow-back-outline"} size={24} color="gray" />
							</Pressable>
						</View>
						<View className="m-5">
							<Text className="font-semibold text-4xl">Enter OTP</Text>
							<Text className="text-xl mt-5 text-gray-500">Verification</Text>
						</View>
						<View className="flex-col justify-between flex-1 m-5">
							<View>
								<Text className="text-gray-500 text-xl">
									Enter the OTP code we just sent{"\n"}
									you on your registered Email/Phone number
								</Text>
								<View className="mt-[60px] flex-row items-center gap-2">
									{otp.map((digit, index) => (
										<TextInput
											className={`bg-white mt-2 h-[40px] w-[40px] rounded-lg text-2xl ${
												error ? "border border-red-500" : ""
											}`}
											key={index}
											ref={(input) => (inputs.current[index] = input)}
											value={digit}
											onChangeText={(text) => handleChange(text, index)}
											onKeyPress={(e) => handleKeyPress(e, index)}
											keyboardType="numeric"
											maxLength={1}
											textAlign="center"
										/>
									))}
								</View>
								{error && (
									<Text className="mt-5 text-red-500 text-sm">
										{errorValue}
									</Text>
								)}
								<Text className="mt-5">
									Didn't get OTP?{" "}
									<Text className="text-blue-500">Resend OTP</Text>
								</Text>
							</View>
							<View>
								<TouchableOpacity
									className="bg-blue-500 h-[50px] rounded-lg flex items-center justify-center"
									onPress={submitHandler}
								>
									{buttonloading ? (
										<ActivityIndicator size={"large"} color={"white"} />
									) : (
										<Text className="text-white text-2xl font-semibold">
											Next
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
}
