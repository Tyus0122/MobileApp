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
import { useState, useEffect } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, validatePassword } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export default function Resetpassword() {
	const [showPassword, setShowPassword] = useState(true);
	const [buttonloading, setbuttonloading] = useState(false);
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [password3, setPassword3] = useState("");
	const [error, setError] = useState("");
	async function submitHandler() {
		if (password2 != password3) {
			setError("Passwords do not match");
			return;
		}
		let { valid, message } = validatePassword(password2);
		if (!valid) {
			setError(message);
            return;
		}
		setbuttonloading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		axios
			.post(
				backend_url + "v1/user/changeCurrentPassword",
				{
					current_password: password1,
					new_password: password2,
					confirm_password: password3,
				},
				{
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setError(response.data.err);
				setbuttonloading(false);
				if (response.data.message == "ok") {
					router.push("/(tabs)/profile");
				}
			})
			.catch((err) => {
				console.log(err);
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
						<Text className="font-semibold text-base">Change Password</Text>
					</View>
					<View className="m-5">
						<Text className="font-semibold text-4xl">New Password</Text>
						<Text className="text-base mt-5 text-gray-500">
							Create a new password. Ensure it differs from{"\n"}
							previous ones for security
						</Text>
					</View>
					{error && <Text className="text-red-500 ml-5 text-base">{error}</Text>}
					<View className="flex-col justify-between h-[600px] m-5">
						<View>
							<View className="mt-5 mb-5">
								<Text className="text-base text-gray-500">current Password</Text>
								<View className="relative">
									<TextInput
										className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
										secureTextEntry={showPassword}
										onChangeText={(data) => {
											setPassword1(data);
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
							<View className="mt-5">
								<Text className="text-base text-gray-500">
									Enter new Password
								</Text>
								<View className="relative">
									<TextInput
										className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
										secureTextEntry={showPassword}
										onChangeText={(data) => {
											setPassword2(data);
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
							<View className="mt-5">
								<Text className="text-base text-gray-500">
									Confirm new Password
								</Text>
								<View className="relative">
									<TextInput
										className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
										secureTextEntry={showPassword}
										onChangeText={(data) => {
											setPassword3(data);
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
