import React, { useRef, useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	TextInput,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { EditPhotosComponent } from "./EditPhotosComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend_url } from "@/constants/constants";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export function EditPreview({
	setImage,
	setModalVisible,
	handleSnapPress,
	usersIds,
	post,
	updatePost,
}) {
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formData, setFormData] = useState({
		caption: post.caption,
		city: post.city,
		date: post.date,
		time: post.time.replace(" ", "").replace("AM", "").replace("PM",""),
		files: post.files,
		ampm: post.time[6] + post.time[7],
	});
	let [error, setError] = useState(false);
	let [ErrorVlaue, setErrorVlaue] = useState("");
	let images = post.files.map((i) => i.url ?? i.uri);
	function isValidDate(dateString) {
		const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
		if (!regex.test(dateString)) return false;
		const [day, month, year] = dateString.split("-").map(Number);
		const daysInMonth = new Date(year, month, 0).getDate();
		return day <= daysInMonth;
	}

	function isValidTime(timeString) {
		const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
		return regex.test(timeString);
	}
	function validator() {
		console.log(formData);
		if (formData.caption == "") {
			setError(true);
			setErrorVlaue("Caption is required");
			return false;
		}
		if (formData.city == "") {
			setError(true);
			setErrorVlaue("City is required");
			return false;
		}
		if (formData.date == "") {
			setError(true);
			setErrorVlaue("Date is required");
			return false;
		}
		if (!isValidDate(formData.date)) {
			setError(true);
			setErrorVlaue("Invalid date. Please use DD-MM-YYYY format.");
			return false;
		}
		if (formData.time == "") {
			setError(true);
			setErrorVlaue("Time is required");
			return false;
		}
		if (!isValidTime(formData.time + " " + formData.ampm)) {
			setError(true);
			setErrorVlaue("Invalid time. Please use HH:MM format.");
			return false;
		}
		return true;
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
			data.append("city", formData.city);
			data.append("_id", post._id);
			data.append("date", formData.date);
			data.append("time", formData.time + " " + formData.ampm);
			data.append("caption", formData.caption);
			data.append("peopleTagged", JSON.stringify(usersIds));
			post.files.forEach((file, index) => {
				data.append(`files`, {
					name: file.fileName,
					type: file.mimeType,
					uri: file.url ?? file.uri,
				});
			});
			console.log(data);
			const response = await axios.post(
				backend_url + "v1/user/postEditPost",
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authorization: `Bearer ${token}`,
					},
				}
			);
			setSubmitLoading(false);
			setImage("");
			router.push({
				pathname: "/myPosts",
				params: {
					_id: post._id,
				},
			});
		} catch (error) {
			setSubmitLoading(false);
			console.error(
				"Error creating post:",
				error.response ? error.response.data : error.message
			);
			throw error;
		}
	}
	async function uploadImage(mode = "gallery", selection = "single") {
		console.log("hello world");
		let result = {};

		// if (mode === "gallery" && selection === "single") {
		result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],

			quality: 1,
		});
		// } else if (mode === "gallery" && selection === "multiple") {
		// 	result = await ImagePicker.launchImageLibraryAsync({
		// 		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		// 		allowsMultipleSelection: true,
		// 		aspect: [1, 1],
		// 		quality: 1,
		// 	});
		// } else {
		// 	result = await ImagePicker.launchCameraAsync({
		// 		cameraType: ImagePicker.CameraType.front,
		// 		allowsEditing: true,
		// 		aspect: [1, 1],
		// 		quality: 1,
		// 	});
		// }
		if (!result.canceled) {
			updatePost({ files: [...post.files, ...result.assets] });
		}
	}
	const [mode, setMode] = useState("");
	return (
		<ScrollView keyboardShouldPersistTaps={"always"}>
			<View>
				<View className="flex-row items-center justify-between">
					<Pressable
						onPress={() => router.back()}
						className="flex-row p-5 items-center gap-3"
					>
						<Ionicons name={"close-outline"} size={28} color="gray" />
						<Text className="text-base">New Post</Text>
					</Pressable>
					<Pressable
						className="bg-blue-500 flex items-center justify-center p-2 mr-5 rounded-xl"
						onPress={uploadImage}
					>
						<Text className="text-white  text-base">add Photo</Text>
					</Pressable>
				</View>
				<EditPhotosComponent
					images={images}
					updatePost={updatePost}
					post={post}
				/>
				{error && (
					<View className="ml-5">
						<Text className="text-red-500 text-base fornt-semibold">
							{ErrorVlaue}
						</Text>
					</View>
				)}
				<View>
					<View className="flex-row items-center justify-between gap-5 p-5">
						<Text className="text-base font-semibold">Add a caption</Text>
						<TextInput
							className="bg-white border border-gray-300 rounded-lg p-3"
							style={{
								height: 100,
								width: "70%",
							}}
							onChangeText={(data) => {
								setError(false);
								setFormData({
									...formData,
									caption: data,
								});
							}}
							multiline
							placeholder="Add a caption for the post..."
							value={formData.caption}
						/>
					</View>
					<View className="flex-row items-center justify-between gap-5 p-5">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"location-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Add City</Text>
						</View>
						<TextInput
							className="bg-white border border-gray-300 rounded-lg p-3 w-[70%]"
							placeholder="Enter city"
							onChangeText={(data) => {
								setError(false);
								setFormData({
									...formData,
									city: data,
								});
							}}
							value={formData.city}
						/>
					</View>
					<TouchableOpacity
						className="flex-row items-center justify-between gap-5 p-5"
						onPress={() => {
							setModalVisible(true);
							handleSnapPress(0);
						}}
					>
						<View className="flex-row items-center gap-5">
							<Ionicons name={"person-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Tag People</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</TouchableOpacity>
					<View className="flex-row items-center gap-5 p-5 ">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"calendar-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Event Date</Text>
						</View>
						<TextInput
							className="bg-white border border-gray-300 rounded-lg p-3 w-[60%]"
							placeholder="DD-MM-YYYY"
							onChangeText={(data) => {
								setError(false);
								setFormData({
									...formData,
									date: data,
								});
							}}
							value={formData.date}
						/>
					</View>
					<View className="flex-row items-center gap-5 p-5 ">
						<View className="flex-row items-center gap-5">
							<Ionicons name={"time-outline"} size={28} color="gray" />
							<Text className="text-base font-semibold">Event Time</Text>
						</View>
						<TextInput
							className="bg-white border border-gray-300 rounded-lg p-3 w-[60%]"
							placeholder="HH:MM"
							onChangeText={(data) => {
								setError(false);
								setFormData({
									...formData,
									time: data,
								});
							}}
							value={formData.time}
						/>
					</View>
					<View className="flex-row items-center justify-center mt-3 gap-3">
						<TouchableOpacity
							className={`p-3 rounded-md ${
								formData.ampm === "AM" ? "bg-blue-500" : "bg-gray-300"
							}`}
							onPress={() => setFormData({ ...formData, ampm: "AM" })}
						>
							<Text className="text-white">AM</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className={`p-3 rounded-md ${
								formData.ampm === "PM" ? "bg-blue-500" : "bg-gray-300"
							}`}
							onPress={() => setFormData({ ...formData, ampm: "PM" })}
						>
							<Text className="text-white">PM</Text>
						</TouchableOpacity>
					</View>
					{/* {mode === "" ? (
						<View></View>
					) : (
						<DateTimePicker
							value={new Date()}
							mode={mode}
							is24Hour={false}
							onChange={(e, dates) => {
								setError(false);
								if (mode === "date") {
									setFormData({
										...formData,
										date: formatDate(dates),
									});
								} else if (mode === "time") {
									setFormData({
										...formData,
										time: formatTo12Hour(dates),
									});
								}
								setMode("");
							}}
						/>
					)} */}
					<View className="p-5">
						<TouchableOpacity
							className="p-2 bg-blue-500 flex rounded-xl items-center justify-center h-[60px]"
							onPress={submitHandler}
							disabled={submitLoading}
						>
							{submitLoading ? (
								<ActivityIndicator size={"large"} color={"white"} />
							) : (
								<Text className="text-base font-semibold text-white">
									Share
								</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
