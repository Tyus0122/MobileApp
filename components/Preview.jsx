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
import { PhotosComponent } from "./PhotosComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend_url } from "@/constants/constants";
import axios from "axios";

export function Preview({
	image,
	setImage,
	setModalVisible,
	handleSnapPress,
	usersIds,
}) {
	let [submitLoading, setSubmitLoading] = useState(false);
	let [error, setError] = useState(false);
	let [ErrorVlaue, setErrorVlaue] = useState("");
	let images = image.map((i) => i.uri);
	function formatDate(date) {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}
	function formatTo12Hour(dateString) {
		const date = new Date(dateString);

		// Options for 12-hour format
		const options = {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: true,
		};
		return date.toLocaleTimeString("en-US", options);
	}
	const [formData, setFormData] = useState({
		caption: "",
		city: "",
		date: "",
		time: "",
		files: image,
	});
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
			data.append("date", formData.date);
			data.append("time", formData.time);
			data.append("caption", formData.caption);
			data.append("peopleTagged", JSON.stringify(usersIds));
			formData.files.forEach((file, index) => {
				data.append(`files`, {
					name: file.fileName,
					type: file.mimeType,
					uri: file.uri,
				});
			});
			const response = await axios.post(
				backend_url + "v1/user/postPost",
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
			router.push("/home");
		} catch (error) {
			setSubmitLoading(false);
			console.error(
				"Error creating post:",
				error.response ? error.response.data : error.message
			);
			throw error;
		}
	}
	const [mode, setMode] = useState("");
	return (
		<ScrollView keyboardShouldPersistTaps={"always"}>
			<View>
				<View className="flex-row p-5 items-center gap-3">
					<Pressable onPress={() => setImage("")}>
						<Ionicons name={"close-outline"} size={28} color="gray" />
					</Pressable>
					<Text className="text-2xl">New Post</Text>
				</View>
				<PhotosComponent images={images} />
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
							display="compact"
							is24Hour={false}
							onChange={(e, dates) => {
								setMode("");
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
