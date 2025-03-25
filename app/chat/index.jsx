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
import {
	useState,
	useEffect,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce, uniqueId, groupBy, map } from "lodash";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SocketContext } from "@/app/_layout.jsx";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
export default function Chat() {
	const sheetRef = useRef(null);
	const snapPoints = ["50%"];
	const [modalVisible, setModalVisible] = useState(false);
	const handleSnapPress = useCallback((index) => {
		if (index === -1) setModalVisible(false);
		sheetRef.current?.snapToIndex(index);
	}, []);
	const { socket, useSocket } = useContext(SocketContext);
	const params = useLocalSearchParams();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [isLastPage, setIsLastPage] = useState(false);

	const [messages, setMessages] = useState([]);
	const [otherUser, setOtherUser] = useState({});
	const [msgtosend, setMsgtosend] = useState("");
	const [error, setError] = useState("");
	async function socketRecievehandler(data) {
		if (params.otherUser_id == data.from) {
			setMessages((prevMessages) => [data, ...prevMessages]);
		}
	}
	async function fetchData() {
		socket.on("messagesent", socketRecievehandler);
		setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					"v1/user/getMessages?page=0&conversation_id=" +
					params.conversation_id +
					"&otherUser_id=" +
					params.otherUser_id,
				{
					headers,
				}
			)
			.then((response) => {
				setMessages(response.data.messages);
				setIsLastPage(response.data.isLastPage);
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
		return () => {
			socket.off("messagesent", socketRecievehandler);
		};
	}, []);
	async function sendmsgviasocket(message, token, otherUser) {
		const payload = {
			...message,
			...otherUser,
			token,
			type: "message",
			uid: message._id,
		};
		socket.emit("message", payload);
	}
	async function sendHandler() {
		const token = await AsyncStorage.getItem("BearerToken");
		let time_of_message = new Date();
		let realtime_message = {
			message: msgtosend,
			_id: uniqueId("id-"),
			isSender: true,
			time: time_of_message,
			type: "message",
		};
		setMessages([realtime_message, ...messages]);
		sendmsgviasocket(realtime_message, token, otherUser);
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const data = {
			message: msgtosend,
			time: new Date(),
			conversation_id: params.conversation_id,
			type: "message",
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
	async function reportUser() {
		try {
			ehandleSnapPress(-1);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: params.otherUser_id,
			};
			const response = await axios.post(
				backend_url + "v1/user/reportUser",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				// setUser({ ...user, connectionStatus: "connect" });
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	const formatTime = (time) => {
		const date = new Date(time);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12; // Convert to 12-hour format
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	};
	const formatDate = (time) => {
		const date = new Date(time);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	const groupedMessages = useMemo(() => {
		const grouped = groupBy(messages, (message) => formatDate(message.time));
		return map(grouped, (value, key) => ({
			date: key,
			messages: value.reverse(),
		}));
	}, [messages]);
	const renderItem = ({ item }) => {
		return (
			<View>
				<View className="flex items-center bg-gray-100 py-2">
					<Text className="text-gray-600 text-base">{item.date}</Text>
				</View>
				{item.messages.map((message, index) => {
					if (message.type === "message") {
						return (
							<View
								className={`flex-row messages-center p-3 ${
									message.isSender ? "justify-end" : ""
								}`}
								key={index}
							>
								<View
									className={`flex-row gap-3 justify-center pl-3 pr-3 pt-2 pb-2 rounded-xl ${
										message.isSender ? "bg-blue-500" : "bg-gray-200"
									}`}
								>
									<Text
										className={`text-base ${
											message.isSender ? "text-white" : "text-black"
										}`}
									>
										{message.message}
									</Text>
									<View className="justify-between">
										<View></View>
										<Text
											className={`text-xs mt-1 ${
												message.isSender ? "text-gray-300" : "text-gray-500"
											}`}
										>
											{formatTime(message.time)}
										</Text>
									</View>
								</View>
							</View>
						);
					} else if (message.type === "sharePost") {
						return (
							<TouchableOpacity
								className={`flex-row messages-center p-3 ${
									message.isSender ? "justify-end" : ""
								}`}
								onPress={() => {
									router.push({
										pathname: "/singlepost",
										params: {
											_id: message.message,
										},
									});
								}}
								key={index}
							>
								<View
									className={`flex-row gap-3 justify-center pl-3 pr-3 pt-2 pb-2 rounded-xl ${
										message.isSender ? "bg-blue-500" : "bg-gray-200"
									}`}
								>
									<Text
										className={`text-base ${
											message.isSender ? "text-white" : "text-black"
										}`}
									>
										Tap to open Post
									</Text>
									<View className="justify-between">
										<View></View>
										<Text
											className={`text-xs mt-1 ${
												message.isSender ? "text-gray-300" : "text-gray-500"
											}`}
										>
											{formatTime(message.time)}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						);
					} else if (message.type === "shareProfile") {
						return (
							<TouchableOpacity
								className={`flex-row messages-center p-3 ${
									message.isSender ? "justify-end" : ""
								}`}
								key={index}
								onPress={() => {
									router.push({
										pathname: "/userProfile",
										params: { _id: message.message },
									});
								}}
							>
								<View
									className={`flex-row gap-3 justify-center pl-3 pr-3 pt-2 pb-2 rounded-xl ${
										message.isSender ? "bg-blue-500" : "bg-gray-200"
									}`}
								>
									<Text
										className={`text-base ${
											message.isSender ? "text-white" : "text-black"
										}`}
									>
										Tap to open Profile
									</Text>
									<View className="justify-between">
										<View></View>
										<Text
											className={`text-xs mt-1 ${
												message.isSender ? "text-gray-300" : "text-gray-500"
											}`}
										>
											{formatTime(message.time)}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						);
					}
				})}
			</View>
		);
	};
	async function blockHandler() {
		try {
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: otherUser._id,
				block: true,
			};
			const response = await axios.post(
				backend_url + "v1/user/blockUser",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				router.push("/");
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	async function fetchDataPageWise({ page }) {
		socket.on("messagesent", socketRecievehandler);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					"v1/user/getMessages?page=" +
					page +
					"&conversation_id=" +
					params.conversation_id +
					"&otherUser_id=" +
					params.otherUser_id,
				{
					headers,
				}
			)
			.then((response) => {
				setMessages([...messages, ...response.data.messages]);
				setIsLastPage(response.data.isLastPage);
				setOtherUser({
					pic: response.data.pic,
					fullname: response.data.fullname,
					username: response.data.username,
					show_profile: response.data.show_profile,
					_id: response.data._id,
					logged_in_user_id: response.data.logged_in_user_id,
				});
			})
			.catch((err) => {});
	}
	async function endHandler() {
		if (!isLastPage) {
			setPage(page + 1);
			fetchDataPageWise({ page: page + 1 });
		}
	}
	async function deleteConversationHandler() {
		try {
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: otherUser._id,
				conversation_id: params.conversation_id,
			};
			const response = await axios.post(
				backend_url + "v1/user/deleteConversation",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				router.push("/");
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	return (
<GestureHandlerRootView style={{ flex: 1 }}>
	<SafeAreaView style={{ flex: 1 }}>
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
			style={{ flex: 1 }}
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
									<Ionicons name="arrow-back-outline" size={28} color="gray" />
								</Pressable>
								<Image
									source={
										otherUser.pic && otherUser.pic.url
											? { uri: otherUser.pic.url }
											: imagePlaceholder
									}
									style={{
										width: 30,
										height: 30,
										borderRadius: 50,
										borderColor: "black",
										borderWidth: 1.5,
									}}
								/>
								<Text className="text-base text-black-500">
									{otherUser.fullname}
								</Text>
							</View>
							<Pressable onPress={() => setModalVisible(true)}>
								<Ionicons name="ellipsis-vertical" size={26} color="black" />
							</Pressable>
						</View>
						{messages.length < 6 && (
							<View className="mt-5 flex items-center justify-center">
								<Image
									source={
										otherUser.pic && otherUser.pic.url
											? { uri: otherUser.pic.url }
											: imagePlaceholder
									}
									style={{
										width: 80,
										height: 80,
										borderRadius: 50,
										borderColor: "black",
										borderWidth: 3,
									}}
								/>
								<Text className="text-base text-black-500">
									{otherUser.fullname}
								</Text>
								<Text className="text-base text-black-500">
									{otherUser.username}
								</Text>
								<TouchableOpacity
									className="bg-[#00000040] mt-5 rounded-lg pl-3 pr-3 pt-2 pb-2"
									onPress={() =>
										router.push({
											pathname: "/userProfile",
											params: { _id: otherUser._id },
										})
									}
								>
									<Text className="text-base">View Profile</Text>
								</TouchableOpacity>
							</View>
						)}
						<FlatList
							data={groupedMessages}
							keyExtractor={(item, index) => index.toString()}
							renderItem={renderItem}
							onEndReached={endHandler}
							ListFooterComponent={
								isLastPage ? (
									<View></View>
								) : (
									<View>
										<ActivityIndicator size="large" color="#0000ff" />
									</View>
								)
							}
							inverted
						/>
						<View className="border">
							{error != "" && (
								<Text className="ml-3 text-red-500">{error}</Text>
							)}
							<View className="flex-row p-3">
								<TextInput
									style={{
										backgroundColor: "white",
										height: 40,
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
									onChangeText={(data) => setMsgtosend(data)}
								/>
								<Pressable
									className="flex items-center justify-center border rounded-full bg-green-500"
									onPress={() => {
										if (msgtosend == "") {
											setError("message cannot be empty");
										} else {
											setError("");
											sendHandler();
										}
									}}
									style={{ width: 40, height: 40 }}
								>
									<Ionicons name="send" size={28} color="black" />
								</Pressable>
							</View>
						</View>
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
		{modalVisible && (
			<BottomSheet
				ref={sheetRef}
				snapPoints={snapPoints}
				enablePanDownToClose
				onClose={() => {
					setModalVisible(false);
					handleSnapPress(-1);
				}}
				className="bg-white"
			>
				<View className="flex-1 items-center justify-between mt-5 mb-5">
					<TouchableOpacity onPress={blockHandler}>
						<Text className="text-base text-red-500">Block</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={reportUser}>
						<Text className="text-base text-red-500">Report</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							router.push({
								pathname: "/userProfile",
								params: { _id: otherUser._id },
							})
						}
					>
						<Text className="text-base">View Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={deleteConversationHandler}>
						<Text className="text-base">Delete Conversation</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							router.push({
								pathname: "/searchMessages",
								params: {
									conversation_id: params.conversation_id,
									otherUser_id: params.otherUser_id,
								},
							})
						}
					>
						<Text className="text-base">Search</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setModalVisible(false);
							handleSnapPress(-1);
						}}
					>
						<Text className="text-base">Cancel</Text>
					</TouchableOpacity>
				</View>
			</BottomSheet>
		)}
	</SafeAreaView>
</GestureHandlerRootView>

	);
}
