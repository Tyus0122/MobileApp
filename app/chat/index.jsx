import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { UserMessageComponent } from "@/components/UserMessageComponent";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce, uniqueId } from "lodash";
import userProfile from "../userProfile";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
export default function Chat() {
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [messages, setMessages] = useState([]);
	const [otherUser, setOtherUser] = useState({});
	const [msgtosend, setMsgtosend] = useState("");
	async function fetchData() {
		setLoading(true);
		// setPosts([]);
		// setIsLastPage(false);
		// setPage(0);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					"v1/user/getMessages?conversation_id=" +
					params.conversation_id +
					"&otherUser_id=" +
					params.otherUser_id,
				{
					headers,
				}
			)
			.then((response) => {
				setMessages(response.data.messages);
				setOtherUser({
					pic: response.data.pic,
					fullname: response.data.fullname,
					username: response.data.username,
					show_profile: response.data.show_profile,
					_id: response.data._id,
					logged_in_user_id: response.data.logged_in_user_id,
				});
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	}
	useEffect(() => {
		fetchData();
	}, []);
	async function sendHandler() {
		const token = await AsyncStorage.getItem("BearerToken");
		let time_of_message = new Date();
		setMessages([
			{
				message: msgtosend,
				_id: uniqueId("id-"),
				isSender: true,
				time: time_of_message,
			},

			...messages,
		]);
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const data = {
			message: msgtosend,
			time: new Date(),
			conversation_id: params.conversation_id,
		};
		setMsgtosend("");
		const response = await axios.post(
			backend_url + "v1/user/postMessages",
			data,
			{
				headers,
			}
		);
	}
	const renderItem = ({ item }) => (
		<View
			className={`flex-row items-center p-3 ${
				item.isSender ? "justify-end" : ""
			}`}
		>
			<View
				className={`pl-3 pr-3 pt-2 pb-2 rounded-xl ${
					item.isSender ? "bg-blue-500" : "bg-gray-200"
				}`}
			>
				<Text
					className={`text-lg ${item.isSender ? "text-white" : "text-black"}`}
				>
					{item.message}
				</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<View style={{ flex: 1, backgroundColor: "white" }}>
					{loading ? (
						<View className="h-screen flex items-center justify-center">
							<ActivityIndicator size="large" color="#0000ff" />
						</View>
					) : (
						<View style={{ flex: 1, justifyContent: "space-between" }}>
							<View className="flex-row p-5 items-center justify-between">
								<View className="flex-row items-center gap-3">
									<Pressable onPress={() => router.back()}>
										<Ionicons
											name="arrow-back-outline"
											size={28}
											color="gray"
										/>
									</Pressable>
									<Image
										source={
											otherUser.pic && otherUser.pic.url
												? { uri: otherUser.pic.url }
												: imagePlaceholder
										}
										style={{
											width: 50,
											height: 50,
											borderRadius: 50,
											borderColor: "black",
											borderWidth: 1.5,
										}}
									/>
									<Text className="text-3xl text-black-500">
										{otherUser.fullname}
									</Text>
								</View>
								<Pressable onPress={() => router.back()}>
									<Ionicons name="ellipsis-vertical" size={26} color="black" />
								</Pressable>
							</View>
							{otherUser.show_profile && (
								<View className="mt-5 flex items-center justify-center">
									<Image
										source={
											otherUser.pic && otherUser.pic.url
												? { uri: otherUser.pic.url }
												: imagePlaceholder
										}
										style={{
											width: 100,
											height: 100,
											borderRadius: 50,
											borderColor: "black",
											borderWidth: 3,
										}}
									/>
									<Text className="text-3xl text-black-500">
										{otherUser.fullname}
									</Text>
									<Text className="text-xl text-black-500">
										{otherUser.username}
									</Text>
									<TouchableOpacity
										className="bg-[#00000040] mt-5 rounded-lg pl-3 pr-3 pt-2 pb-2"
										onPress={() => {
											router.push({
												pathname: "/userProfile",
												params: { _id: otherUser._id },
											});
										}}
									>
										<Text className="text-2xl">View Profile</Text>
									</TouchableOpacity>
								</View>
							)}
							<FlatList
								data={messages}
								keyExtractor={(item) => item._id.toString()}
								renderItem={renderItem}
								ListFooterComponent={
									<View>
										<ActivityIndicator size="large" color="#0000ff" />
									</View>
								}
								inverted
							/>
							<View className="border">
								<View className="flex-row p-3">
									<TextInput
										style={{
											backgroundColor: "white",
											height: 50,
											paddingHorizontal: 15,
											fontSize: 18,
											borderRadius: 25,
											borderColor: "#ccc",
											borderWidth: 1,
											width: "90%",
										}}
										multiline={true}
										value={msgtosend}
										placeholder="Type your message..."
										onChangeText={(data) => {
											setMsgtosend(data);
										}}
									/>
									<Pressable
										className="flex items-center justify-center border rounded-full bg-green-500"
										onPress={sendHandler}
										style={{ width: 50, height: 50 }}
									>
										<Ionicons name="send" size={28} color="black" />
									</Pressable>
								</View>
							</View>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
