import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { React, useState, useEffect, useContext, useRef } from "react";
import { Link, router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-input";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { SocketContext } from "@/app/_layout.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen() {
	// const printAllAsyncStorage = async () => {
	// 	try {
	// 	  // Retrieve all keys
	// 	  const keys = await AsyncStorage.getAllKeys();

	// 	  // If keys exist, fetch all values
	// 	  if (keys.length > 0) {
	// 		const keyValuePairs = await AsyncStorage.multiGet(keys);

	// 		// Log all key-value pairs
	// 		console.log("AsyncStorage Contents:");
	// 		keyValuePairs.forEach(([key, value]) => {
	// 		  console.log(`${key}: ${value}`);
	// 		});
	// 	  } else {
	// 		console.log("AsyncStorage is empty.");
	// 	  }
	// 	} catch (error) {
	// 	  console.error("Error retrieving data from AsyncStorage:", error);
	// 	}
	//   };

	//   printAllAsyncStorage();
	const { socket, setSocket } = useContext(SocketContext);
	const [showPassword, setShowPassword] = useState(true);
	const [isChecked, setIsChecked] = useState(false);
	const [submit, setSubmit] = useState(false);
	const PhoneInputRef = useRef(null);
	const [error, setError] = useState(false);
	const [errorValue, setErrorVlaue] = useState("");
	const [formData, setFormData] = useState({
		phnocode: "+1",
		phno: "",
		password: "",
	});
	function validator() {
		let phno = formData.phno.replace(formData.phnocode, "");
		if (phno.length == 0) {
			setError(true);
			setErrorVlaue("Phone number is required");
			return;
		}
		if (phno.length !== 10) {
			setError(true);
			setErrorVlaue("Phone number must be at least 10 characters");
			return;
		}
		submitHandler();
	}
	function submitHandler() {
		setSubmit(true);
		setError(false);
		axios
			.post(backend_url + "v1/user/loginOtpSubmit", formData)
			.then((response) => {
				setSubmit(false);
				AsyncStorage.setItem("BearerToken", response.data.BearerToken);
				socket.emit("registerTheToken", { token: response.data.BearerToken });
				router.push("/main");
			})
			.catch((err) => {
				setSubmit(false);
				if (err.status === 404) {
					setError(true);
					setErrorVlaue("No record found with the given Phone number");
				}
				if (err.status === 420) {
					setError(true);
					setErrorVlaue("phone number or password is incorrect");
				}
				console.log(err.status);
			});
	}
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps={"always"}
			keyboardDismissMode="on-drag"
		>
			<SafeAreaView>
				<ToastManager duration={3000} />
				<View className="h-screen bg-blue-50 p-[15%]">
					<View className="items-center mt-[40px] mb-5">
						<Image
							source={require("@/assets/tyuss/loginLogo.png")}
							style={{
								width: 80,
								height: 80,
							}}
						/>
					</View>
					<View className="mt-5 mb-5">
						<Text className="text-5xl font-extrabold mb-2">
							Sign in to your
						</Text>
						<Text className="text-5xl font-extrabold mb-2">Account</Text>
						<Text className="mb-2 text-base text-gray-500">
							Enter your mobile number to log in
						</Text>
					</View>
					{error && (
						<Text className="text-red-500 text-base mt-2">{errorValue}</Text>
					)}
					<View className="mt-5">
						<Text className="text-base text-gray-500 mb-3">Phone</Text>
						<View className="flex-row items-center gap-2">
							<View className="p-2 bg-white h-[40px] rounded-lg flex-row items-center mr-2">
								<Ionicons name={"chevron-down-outline"} size={8} color="gray" />
								<PhoneInput
									ref={PhoneInputRef}
									onSelectCountry={(data) => {
										setFormData({
											...formData,
											phnocode: "+" + PhoneInputRef.current.getCountryCode(),
										});
									}}
									onChangePhoneNumber={(data) => {
										setFormData({
											...formData,
											phno: data,
										});
										setError(false);
									}}
									initialCountry={"us"}
								/>
							</View>
						</View>
					</View>
					<View className="mt-5 mb-5">
						<Text className="text-base text-gray-500">Password</Text>
						<View className="relative">
							<TextInput
								className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
								secureTextEntry={showPassword}
								onChangeText={(data) => {
									setFormData({
										...formData,
										password: data,
									});
									setError(false);
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
									name={isChecked ? "checkbox-outline" : "square-outline"}
									size={24}
									color="gray"
								/>
							</Pressable>
							<Text className="text-base text-gray-500">Remember me</Text>
						</View>
						<Pressable
							className="flex-row items-center gap-2"
							onPress={() => {
								router.push("/forgotphno");
							}}
						>
							<Text className="text-base text-blue-500">Forgot Password</Text>
						</Pressable>
					</View>
					<View className="mt-5">
						<Pressable
							className="bg-blue-500 h-[40px] rounded-lg flex-row items-center justify-center"
							onPress={validator}
						>
							{submit ? (
								<ActivityIndicator size={"large"} color={"white"} />
							) : (
								<Text className="text-white text-base font-semibold">
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
					<View className="mt-5 flex-row justify-center">
						<Text className="text-base text-gray-500">
							Not Registered Yet?{" "}
							<Link href={"/signup"}>
								<Text className="text-blue-500">Sign Up</Text>
							</Link>
						</Text>
					</View>
				</View>
			</SafeAreaView>
		</KeyboardAwareScrollView>
	);
}
