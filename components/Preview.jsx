import React, { useRef, useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	Pressable,
	TouchableOpacity,
	TextInput,
	ScrollView,
	ActivityIndicator,
	Platform,
	KeyboardAvoidingView,
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
		ampm: "AM",
		files: image,
	});
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
			data.append("date", formData.date);
			data.append("time", formData.time + " " + formData.ampm);
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

				<View>
					<View className="flex-row p-5 items-center gap-3">
						<Pressable onPress={() => setImage("")}>
							<Ionicons name={"close-outline"} size={28} color="gray" />
						</Pressable>
						<Text className="text-base">New Post</Text>
					</View>
					<PhotosComponent images={images} />
					{error && (
						<View className="ml-5">
							<Text className="text-red-500 text-base fornt-semibold">
								{ErrorVlaue}
							</Text>
						</View>
					)}
					<View>
						<View className="flex-row items-center justify-start gap-5 p-5">
							<Text className="text-base font-semibold">Add a caption</Text>
							<TextInput
								className="bg-white border border-gray-300 rounded-lg p-3"
								style={{
									height: 100,
									width: "60%",
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
						<View className="flex-row items-center justify-start gap-5 ml-5 mr-5">
							<View className="flex-row items-center gap-5">
								<Ionicons name={"location-outline"} size={28} color="gray" />
								<Text className="text-base font-semibold">Add City</Text>
							</View>
							<TextInput
								className="bg-white border border-gray-300 rounded-lg p-3 w-[60%]"
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
							className="flex-row items-center justify-between gap-5 m-5"
							onPress={() => {
								setModalVisible(true);
								handleSnapPress(0);
							}}
						>
							<View className="flex-row items-center gap-5">
								<Ionicons name={"person-outline"} size={28} color="gray" />
								<Text className="text-base font-semibold">Tag People</Text>
							</View>
							<Ionicons
								className="mr-5"
								name={"chevron-forward-outline"}
								size={28}
								color="gray"
							/>
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
	);
}
