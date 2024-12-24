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
	const params = useLocalSearchParams();
	const flatListRef = useRef(null);
	const scrollToMessage = (messageIndex) => {
		flatListRef.current.scrollToIndex({
			index: messageIndex,
			animated: true,
		});
	};
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [otherUser, setOtherUser] = useState({});
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
	async function fetchData() {
		setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					"v1/user/getAllMessages?conversation_id=" +
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
					<Text className="text-gray-600 text-lg">{item.date}</Text>
				</View>
				{item.messages.map((message, index) => {
					const messageRef = React.createRef(index);
					// messageRefs.current[
					// 	messages.findIndex((msg) => msg._id === message._id)
					// ] = messageRef;
					const isHighlighted =
						searchResults.length > 0 &&
						searchResults[currentMatchIndex]?.messageId === message._id;

					if (message.type === "message") {
						return (
							<View
								className={`flex-row messages-center p-3 ${
									message.isSender ? "justify-end" : ""
								}`}
								key={index}
								ref={messageRef}
							>
								<View
									className={`flex-row gap-3 justify-center pl-3 pr-3 pt-2 pb-2 rounded-xl ${
										message.isSender ? "bg-blue-500" : "bg-gray-200"
									} ${isHighlighted ? "bg-green-500" : ""} `}
								>
									<Text
										className={`text-lg ${
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
										className={`text-lg ${
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
										className={`text-lg ${
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
	const searchMessages = async (query) => {
		setSearchQuery(query);
		if (!query) {
			setSearchResults([]);
			setCurrentMatchIndex(-1);
			return;
		}
		const filteredResults = groupedMessages.reverse()
			.map((group, groupIndex) => {
				const matchingMessages = group.messages
					.map((message, messageIndex) =>
						message.message.includes(query)
							? {
									groupIndex,
									messageIndex,
									messageId: message._id,
							  }
							: null
					)
					.filter(Boolean);
				return matchingMessages;
			})
			.flat();
		setSearchResults(filteredResults);
		setCurrentMatchIndex(filteredResults.length > 0 ? 0 : -1); // Highlight first match
	};

	const debounceSearch = useCallback(
		debounce((query) => searchMessages(query), debounce_time),
		[groupedMessages, messages]
	);
	const handleNavigation = (direction) => {
		if (direction === "up" && currentMatchIndex > 0) {
			scrollToMessage(searchResults[currentMatchIndex].groupIndex - 1);
			setCurrentMatchIndex((prev) => prev - 1);
		} else if (
			direction === "down" &&
			currentMatchIndex < searchResults.length - 1
		) {
			scrollToMessage(searchResults[currentMatchIndex].groupIndex + 1);
			setCurrentMatchIndex((prev) => prev + 1);
		}
	};
	return (
		<GestureHandlerRootView>
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
								</View>
								<View>
									<View className="flex-row items-center bg-[#ECE6F0] rounded-full h-[50px] p-3">
										<Ionicons
											name="search-outline"
											size={20}
											color="gray"
											style={{ position: "absolute", left: 15 }}
										/>
										<TextInput
											style={{
												// flex: 1,
												height: "100%",
												paddingLeft: 40,
											}}
											className="w-full"
											onChangeText={debounceSearch}
											placeholder="Search by message ..."
										/>
									</View>
								</View>
								{searchResults.length > 0 && (
									<View className="flex-row justify-between items-center p-3">
										<Pressable
											onPress={() => handleNavigation("up")}
											disabled={currentMatchIndex <= 0}
										>
											<Ionicons
												name="arrow-up-circle"
												size={30}
												color={currentMatchIndex > 0 ? "blue" : "gray"}
											/>
										</Pressable>
										<Text>
											{currentMatchIndex + 1} / {searchResults.length}
										</Text>
										<Pressable
											onPress={() => handleNavigation("down")}
											disabled={currentMatchIndex >= searchResults.length - 1}
										>
											<Ionicons
												name="arrow-down-circle"
												size={30}
												color={
													currentMatchIndex < searchResults.length - 1
														? "blue"
														: "gray"
												}
											/>
										</Pressable>
									</View>
								)}
								<FlatList
									ref={flatListRef}
									data={groupedMessages}
									keyExtractor={(item, index) => index.toString()}
									renderItem={renderItem}
									ListFooterComponent={<View></View>}
									inverted
									keyboardDismissMode="on-drag"
								/>
							</View>
						)}
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
}
