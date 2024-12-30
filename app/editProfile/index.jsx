import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	BackHandler,
	StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { BlurView } from "expo-blur";

export default function editProfile() {
	const params = useLocalSearchParams();
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState({
		changeText: false,
		changePic: false,
		fullname: params.fullname,
		username: params.username,
		bio: params.bio,
		city: params.city,
		university: params.university,
		accomodation: params.accomodation == "true" ? true : false,
		pic: params.pic,
		files: [
			{
				fileName: "tmp_file",
				mimeType: "image/jpeg",
				uri: params.pic,
			},
		],
	});
	async function uploadImage(mode = "gallery", selection = "single") {
		let result = {};

		if (mode === "gallery" && selection === "single") {
			result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],

				quality: 1,
			});
		} else if (mode === "gallery" && selection === "multiple") {
			result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsMultipleSelection: true,
				aspect: [1, 1],
				quality: 1,
			});
		} else {
			result = await ImagePicker.launchCameraAsync({
				cameraType: ImagePicker.CameraType.front,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});
		}
		if (!result.canceled) {
			setFormData({
				...formData,
				pic: result.assets[0].uri,
				files: result.assets,
				changePic: true,
			});
		}
	}
	async function submitHandler() {
		try {
			setSubmitLoading(true);
			if (!validator()) {
				setSubmitLoading(false);
				return;
			}
			const token = await AsyncStorage.getItem("BearerToken");
			const data = new FormData();
			data.append("fullname", formData.fullname);
			data.append("username", formData.username);
			data.append("bio", formData.bio);
			data.append("city", formData.city);
			data.append("university", formData.university);
			data.append("accomodation", formData.accomodation);
			data.append("changePic", formData.changePic);
			data.append(`file`, {
				name: formData.files[0].fileName,
				type: formData.files[0].mimeType,
				uri: formData.files[0].uri,
			});
			const response = await axios.post(
				backend_url + "v1/user/editProfilePost",
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authorization: `Bearer ${token}`,
					},
				}
			);
			setSubmitLoading(false);
			router.push("/profile");
		} catch (error) {
			setSubmitLoading(false);
			console.error(
				"Error creating post:",
				error.response ? error.response.data : error.message
			);
			throw error;
		}
	}
	function validator() {
		if (formData.changePic || formData.changeText) {
			return true;
		}
		return false;
	}
	return (
		<SafeAreaView>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<ScrollView
					keyboardShouldPersistTaps={"always"}
					keyboardDismissMode="on-drag"
					className="bg-white h-screen"
				>
					<View className="flex-row p-5 items-center justify-between gap-3">
						<View className="flex-row items-center justify-center gap-3">
							<Pressable onPress={() => router.back()}>
								<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
							</Pressable>
							<Text className="text-2xl">Edit Profile</Text>
						</View>
						<TouchableOpacity onPress={submitHandler}>
							<Text
								className={`text-2xl ${
									formData.changePic || formData.changeText
										? "text-blue-500"
										: "text-gray-500"
								}`}
							>
								save
							</Text>
						</TouchableOpacity>
					</View>
					<View className="p-3 items-center">
						<Image
							source={formData.pic ? { uri: formData.pic } : imagePlaceholder}
							style={{
								width: 100,
								height: 100,
								borderRadius: 50,
								borderColor: "black",
								borderWidth: 1,
							}}
						/>
						<TouchableOpacity onPress={() => uploadImage("gallery", "single")}>
							<Text className="text-blue-500 text-xl mt-3">Edit Picture</Text>
						</TouchableOpacity>
					</View>
					<View className="p-5 items-center">
						<View className="w-[80%]">
							<Text className="text-xl">Full name</Text>
							<TextInput
								className="border border-gray-500 rounded-xl mt-3 h-[50px] pl-5 text-2xl"
								value={formData.fullname}
								onChangeText={(data) =>
									setFormData({ ...formData, fullname: data, changeText: true })
								}
							/>

							<Text className="text-xl mt-3">User_name</Text>
							<TextInput
								className="border border-gray-500 rounded-xl mt-3 h-[50px] pl-5 text-2xl"
								value={formData.username}
								onChangeText={(data) => {
									setFormData({
										...formData,
										username: data,
										changeText: true,
									});
								}}
							/>

							<Text className="text-xl mt-3">Bio</Text>
							<TextInput
								multiline
								className="border border-gray-500 rounded-xl mt-3 h-[50px] pl-5 text-2xl"
								value={formData.bio}
								onChangeText={(data) => {
									setFormData({ ...formData, bio: data, changeText: true });
								}}
							/>

							<Text className="text-xl mt-3">City/Location</Text>
							<TextInput
								className="border border-gray-500 rounded-xl mt-3 h-[50px] pl-5 text-2xl"
								value={formData.city}
								onChangeText={(data) => {
									setFormData({ ...formData, city: data, changeText: true });
								}}
							/>

							<Text className="text-xl mt-3">University</Text>
							<TextInput
								className="border border-gray-500 rounded-xl mt-3 h-[50px] pl-5 text-2xl"
								value={formData.university}
								onChangeText={(data) => {
									setFormData({
										...formData,
										university: data,
										changeText: true,
									});
								}}
							/>

							<View className="border flex-row items-center justify-between p-3 border-gray-500 rounded-xl mt-5 h-[50px] ">
								<Text className="text-xl">Accomodation</Text>
								<Pressable
									className={`h-[30px] w-[60px]  mr-5 rounded-full border ${
										formData.accomodation ? "items-end bg-green-500" : "bg-gray-200"
									}`}
									onPress={() => {
										setFormData({
											...formData,
											accomodation: !formData.accomodation,
											changeText: true,
										});
									}}
								>
									<View className="bg-white h-[30px] w-[35px] rounded-full"></View>
								</Pressable>
							</View>
						</View>
					</View>
				</ScrollView>
				{submitLoading && (
					<BlurView
						className="h-screen"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
						intensity={50}
						tint="dark"
					>
						<View className="h-screen flex items-center justify-center">
							<ActivityIndicator size="large" color="#fff" />
						</View>
					</BlurView>
				)}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
