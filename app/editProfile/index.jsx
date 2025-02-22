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
	ActivityIndicator,
	StyleSheet,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";

const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export default function EditProfile() {
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
		accomodation: params.accomodation === "true",
		pic: params.pic ?? "",
		files: [
			{
				fileName: "tmp_file",
				mimeType: "image/jpeg",
				uri: params.pic,
			},
		],
	});

	async function uploadImage() {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

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
			if (!formData.changePic && !formData.changeText) {
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

			if (formData.files[0]?.uri) {
				data.append("file", {
					name: formData.files[0].fileName,
					type: formData.files[0].mimeType,
					uri: formData.files[0].uri,
				});
			}

			await axios.post(backend_url + "v1/user/editProfilePost", data, {
				headers: {
					"Content-Type": "multipart/form-data",
					authorization: `Bearer ${token}`,
				},
			});

			setSubmitLoading(false);
			router.push("/profile");
		} catch (error) {
			setSubmitLoading(false);
			console.error("Error editing profile:", error.response?.data || error.message);
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "position" : "height"}
					keyboardVerticalOffset={20}
					style={{ flex: 1 }}
				>
					<ScrollView
						keyboardShouldPersistTaps="handled"
						className="bg-white h-screen"
						keyboardDismissMode="on-drag"
					>
						{/* Header */}
						<View className="flex-row p-5 items-center justify-between gap-3">
							<View className="flex-row items-center justify-center gap-3">
								<Pressable onPress={() => router.back()}>
									<Ionicons name="arrow-back-outline" size={28} color="gray" />
								</Pressable>
								<Text className="text-base">Edit Profile</Text>
							</View>
							<TouchableOpacity onPress={submitHandler}>
								<Text
									className={`text-base ${
										formData.changePic || formData.changeText
											? "text-blue-500"
											: "text-gray-500"
									}`}
								>
									Save
								</Text>
							</TouchableOpacity>
						</View>

						{/* Profile Picture */}
						<View className="p-3 items-center">
							<Image
								source={formData.pic ? { uri: formData.pic } : imagePlaceholder}
								style={{
									width: 80,
									height: 80,
									borderRadius: 50,
									borderColor: "black",
									borderWidth: 1,
								}}
							/>
							<TouchableOpacity onPress={uploadImage}>
								<Text className="text-blue-500 text-base mt-3">Edit Picture</Text>
							</TouchableOpacity>
						</View>

						{/* Form Inputs */}
						<View className="p-5 items-center">
							<View className="w-[80%]">
								{[
									["Full name", "fullname"],
									["Username", "username"],
									["Bio", "bio"],
									["City/Location", "city"],
									["University", "university"],
								].map(([label, key]) => (
									<View key={key} className="mt-3">
										<Text className="text-base">{label}</Text>
										<TextInput
											className="border border-gray-500 rounded-xl mt-3 h-[40px] pl-5 text-base"
											value={formData[key]}
											multiline={key === "bio"}
											onChangeText={(data) =>
												setFormData((prev) => ({
													...prev,
													[key]: data,
													changeText: true,
												}))
											}
										/>
									</View>
								))}

								{/* Accomodation Toggle */}
								<View className="border flex-row items-center justify-between p-3 border-gray-500 rounded-xl mt-5 h-[40px]">
									<Text className="text-base">Accomodation</Text>
									<Pressable
										className={`h-[30px] w-[60px] rounded-full border ${
											formData.accomodation ? "items-end bg-green-500" : "bg-gray-200"
										}`}
										onPress={() =>
											setFormData((prev) => ({
												...prev,
												accomodation: !prev.accomodation,
												changeText: true,
											}))
										}
									>
										<View className="bg-white h-[30px] w-[35px] rounded-full"></View>
									</Pressable>
								</View>
							</View>
						</View>
					</ScrollView>

					{/* Loading Indicator */}
					{submitLoading && (
						<BlurView
							className="h-screen"
							style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
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
