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
		time: post.time,
		files: post.files,
	});
	let [error, setError] = useState(false);
	let [ErrorVlaue, setErrorVlaue] = useState("");
	let images = post.files.map((i) => i.url ?? i.uri);
	function formatDate(date) {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}
	function formatTo12Hour(dateString) {
		const date = new Date(dateString);
		const options = {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		};
		return date.toLocaleTimeString("en-US", options);
	}
	function validator() {
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
		if (formData.time == "") {
			setError(true);
			setErrorVlaue("Time is required");
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
			data.append("time", formData.time);
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
						onPress={() =>
							router.push({
								pathname: "/myPosts",
								params: {
									_id: post._id,
								},
							})
						}
						className="flex-row p-5 items-center gap-3"
					>
						<Ionicons name={"close-outline"} size={28} color="gray" />
						<Text className="text-2xl">New Post</Text>
					</Pressable>
					<Pressable
						className="bg-blue-500 flex items-center justify-center p-2 mr-5 rounded-xl"
						onPress={uploadImage}
					>
						<Text className="text-white  text-xl">add Photo</Text>
					</Pressable>
				</View>
				<EditPhotosComponent
					images={images}
					updatePost={updatePost}
					post={post}
				/>
				{error && (
					<View className="ml-5">
						<Text className="text-red-500 text-xl fornt-semibold">
							{ErrorVlaue}
						</Text>
					</View>
				)}
				<View>
					<View className="flex-row items-center justify-between gap-5 p-5">
						<Text className="text-xl font-semibold">Add a caption</Text>
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
							<Text className="text-xl font-semibold">Add City</Text>
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
							<Text className="text-xl font-semibold">Tag People</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</TouchableOpacity>
					<TouchableOpacity
						className="flex-row items-center justify-between gap-5 p-5"
						onPress={() => {
							setMode("date");
						}}
					>
						<View className="flex-row items-center gap-5">
							<Ionicons name={"calendar-outline"} size={28} color="gray" />
							<Text className="text-xl font-semibold">Event Date</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</TouchableOpacity>
					<TouchableOpacity
						className="flex-row items-center justify-between gap-5 p-5"
						onPress={() => {
							setMode("time");
						}}
					>
						<View className="flex-row items-center gap-5">
							<Ionicons name={"time-outline"} size={28} color="gray" />
							<Text className="text-xl font-semibold">Event End Time</Text>
						</View>
						<Ionicons name={"chevron-forward-outline"} size={28} color="gray" />
					</TouchableOpacity>
					{mode === "" ? (
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
					)}
					<View className="p-5">
						<TouchableOpacity
							className="p-2 bg-blue-500 flex rounded-xl items-center justify-center h-[60px]"
							onPress={submitHandler}
							disabled={submitLoading}
						>
							{submitLoading ? (
								<ActivityIndicator size={"large"} color={"white"} />
							) : (
								<Text className="text-2xl font-semibold text-white">Share</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
