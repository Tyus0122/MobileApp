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
	const [isChecked, setIsChecked] = useState(false);
	const [submit, setSubmit] = useState(false);
	const PhoneInputRef = useRef(null);
	const [error, setError] = useState(false);
	const [errorValue, setErrorVlaue] = useState("");
	const [formData, setFormData] = useState({
		phnocode: "+91",
		phno: "+919492031971",
	});
	function validator() {
		let phno = formData.phno.replace(formData.phnocode, "")
		console.log(formData)
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
		setError(false)
		axios
			.post(backend_url + "v1/user/loginSubmit", formData)
			.then((response) => {
				setSubmit(false);
				router.push({
					pathname: "loginOtp",
					params: {
						phno: formData.phno,
					}
				})
			})
			.catch((err) => {
				setSubmit(false);
				if (err.status === 404) {
					setError(true);
					setErrorVlaue("No record found with the given Phone number");
				}
				console.log(err.status);
			});
	}
	return (
		<SafeAreaView>
			<ToastManager duration={3000} />
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				keyboardDismissMode="on-drag"
			>
				<View className="h-screen bg-blue-50 p-[15%]">
					<View className="items-center mt-[40px] mb-5">
						<Image
							source={require("@/assets/tyuss/loginLogo.png")}
							style={{
								width: 50,
								height: 50,
							}}
						/>
					</View>
					<View className="mt-5 mb-5">
						<Text className="text-5xl font-extrabold mb-2">
							Sign in to your
						</Text>
						<Text className="text-5xl font-extrabold mb-2">Account</Text>
						<Text className="mb-2 text-lg text-gray-500">
							Enter your email and password to log in
						</Text>
					</View>
					{error && (
						<Text className="text-red-500 text-lg mt-2">{errorValue}</Text>
					)}
					<View className="mt-5">
						<Text className="text-xl text-gray-500 mb-3">Phone</Text>
						<View className="flex-row items-center gap-2">
							<View className="p-2 bg-white h-[50px] rounded-lg flex-row items-center mr-2">
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
									initialCountry={"in"}
								/>
							</View>
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
							<Text className="text-xl text-gray-500">Remember me</Text>
						</View>
					</View>
					<View className="mt-5">
						<Pressable
							className="bg-blue-500 h-[50px] rounded-lg flex-row items-center justify-center"
							onPress={validator}
						>
							{submit ? (
								<ActivityIndicator size={"large"} color={"white"} />
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
	);
}
