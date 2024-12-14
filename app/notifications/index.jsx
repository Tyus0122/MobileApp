import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	FlatList,
	Platform,
	KeyboardAvoidingView,
	Keyboard,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { ShareUserComponent } from "@/components/ShareUserComponent";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import { NotificationsRequestComponent } from "@/components/NotificationsRequestComponent";
import { Notifications7Days } from "@/components/Notifications7Days";
import { NotificationsConnectComponent } from "@/components/NotificationsConnectComponent";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function mainNotifications() {
	const [notifications, setNotifications] = useState({
		requests: [],
		notifications: [],
		suggestions: [],
		loading: false,
	});
	function updateNotificationState(newState) {
		setNotifications((prevState) => ({ ...prevState, ...newState }));
	}
	async function fetchData() {
		setNotifications({ ...notifications, loading: true });
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getNotifications", { headers })
			.then((response) => {
				setNotifications({
					...notifications,
					requests: response.data.requests ?? [],
					loading: false,
					suggestions: response.data.suggestions ?? [],
					notifications: response.data.notifications ?? [],
				});
			})
			.catch((err) => {
				setNotifications({ ...notifications, loading: false });
			});
	}
	useEffect(() => {
		fetchData();
	}, []);
	return (
		<SafeAreaView>
			{notifications.loading ? (
				<View className="h-screen flex items-center justify-center">
					<ActivityIndicator size="large" color="blue" />
				</View>
			) : (
				<ScrollView>
					<Pressable
						className="flex-row p-5 items-center gap-3"
						onPress={() => router.back()}
					>
						<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
						<Text className="text-3xl">Notifications</Text>
					</Pressable>
					{notifications.requests.length > 0 && (
						<View className="m-3">
							<Text className="text-3xl">Requests</Text>
						</View>
					)}
					{notifications.requests.map((user, index) => (
						<NotificationsRequestComponent
							user={user}
							index={index}
							key={index}
							notifications={notifications}
							updateNotificationState={updateNotificationState}
						/>
					))}
					{notifications.requests.length >= 5 && (
						<TouchableOpacity
							className=" items-end mr-5 mt-3"
							onPress={() => router.push("/requests")}
						>
							<Text className="mr-5 text-2xl text-blue-500">See All</Text>
						</TouchableOpacity>
					)}
					{notifications.notifications.length > 0 && (
						<View className="m-3">
							<Text className="text-3xl">Last 7 Days</Text>
						</View>
					)}
					{notifications.notifications.map((item, index) => (
						<Notifications7Days item={item} index={index} key={index} />
					))}
					{notifications.notifications.length >= 5 && (
						<TouchableOpacity
							className=" items-end mr-5 mt-3"
							onPress={() => router.push("/latestNotifications")}
						>
							<Text className="mr-5 text-2xl text-blue-500">See All</Text>
						</TouchableOpacity>
					)}
					{notifications.suggestions.length > 0 && (
						<View className="m-3">
							<Text className="text-3xl">Suggestions</Text>
						</View>
					)}
					{notifications.suggestions.map((user, index) => (
						<NotificationsConnectComponent
							user={user}
							index={index}
							key={index}
							notifications={notifications}
							updateNotificationState={updateNotificationState}
						/>
					))}
					{notifications.suggestions.length >= 5 && (
						<TouchableOpacity
							className=" items-end mr-5 mt-3"
							onPress={() => router.push("/suggestions")}
						>
							<Text className="mr-5 text-2xl text-blue-500">See All</Text>
						</TouchableOpacity>
					)}
					<View className="h-[50px]"></View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
}
