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
import React, { useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import PhoneInput from "react-native-phone-input";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ForgotPhno() {
	const PhoneInputRef = useRef(null);
	const [buttonloading, setbuttonloading] = useState(false);
	const [error, setError] = useState(false);
	const [errorValue, setErrorVlaue] = useState("");
	const [formData, setFormData] = useState({
		phno: "",
		phnocode: "+1",
	});
	function submitHandler() {
		setbuttonloading(true);
		axios
			.post(backend_url + "v1/user/getOtp", { phno: formData.phno })
			.then((response) => {
				setbuttonloading(false);
				router.push({
					pathname: "/forgototp",
					params: { phno: formData.phno },
				});
			})
			.catch((err) => {
				if (err.status == 420) {
					setError(true);
					setErrorVlaue("Enter Valid Phone Number");
				}
				setbuttonloading(false);
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
							<Ionicons name={"arrow-back-outline"} size={24} color="gray" />
						</Pressable>
						<Text className="font-semibold text-base">Forgot Password</Text>
					</View>
					<View className="m-5">
						<Text className="font-semibold text-4xl">Enter phone No</Text>
						<Text className="text-base mt-5 text-gray-500">
							Enter your registered email/phone number
						</Text>
					</View>
					<View className="flex-col justify-between h-[600px] m-5">
						<View>
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
							{error && (
								<Text className="mt-5 text-base text-red-500">{errorValue}</Text>
							)}
						</View>
						<View>
							<TouchableOpacity
								className="bg-blue-500 h-[40px] rounded-lg flex items-center justify-center"
								onPress={submitHandler}
								// disabled={buttonloading}
							>
								{buttonloading ? (
									<ActivityIndicator size={"large"} color={"white"} />
								) : (
									<Text className="text-white text-base font-semibold">
										Send OTP
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
