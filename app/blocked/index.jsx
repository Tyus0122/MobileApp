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
import {BlockedUsersComponent } from "@/components/BlockedUsersComponent";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function blocked() {
	const [notifications, setNotifications] = useState({
		suggestions: [],
		loading: false,
		page: 0,
		isLastPage: false,
    });    
	function updateNotificationState(newState) {
		setNotifications((prevState) => ({ ...prevState, ...newState }));
	}
	async function fetchData(page, fromLast) {
		if (notifications.page == 0)
			setNotifications({ ...notifications, loading: true });
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getBlockedUsers?page=" + page, { headers })
			.then((response) => {
				setNotifications({
					...notifications,
					suggestions: response.data.suggestions ?? [],
					isLastPage: response.data.isLastPage,
					loading: false,
				});
			})
			.catch((err) => {
				if (notifications.page == 0)
					setNotifications({ ...notifications, loading: false });
			});
	}
	async function fetchDataPageWise(page) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getBlockedUsers?page=" + page, { headers })
			.then((response) => {
				updateNotificationState({
					suggestions: [
						...notifications.suggestions,
						...(response.data.suggestions ?? []),
					],
					loading: false,
					isLastPage: response.data.isLastPage,
				});
			})
			.catch((err) => {
				if (notifications.page == 0)
					setNotifications({ ...notifications, loading: false });
			});
	}
	useEffect(() => {
		fetchData(0, false);
	}, []);
	async function endHandler() {
		if (!notifications.isLastPage) {
			fetchDataPageWise(notifications.page + 1);
			updateNotificationState({ page: notifications.page + 1 });
		}
	}
	const renderItem = ({ item, index }) => (
		<BlockedUsersComponent
			user={item}
			index={index}
			notifications={notifications}
			updateNotificationState={updateNotificationState}
		/>
	);

	return (
		<SafeAreaView className="flex-1">
			{/* Back Button and Header */}
			<Pressable
				className="flex-row p-5 items-center gap-3"
				onPress={() => router.back()}
			>
				<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
				<Text className="text-3xl">Blocked Users</Text>
			</Pressable>

			{/* Content */}
			{notifications.loading ? (
				<View className="h-screen flex items-center justify-center">
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			) : (
				<FlatList
					data={notifications.suggestions}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
					ListEmptyComponent={
						<Text className="text-center text-gray-500 mt-5">
							No suggestions available.
						</Text>
					}
					ListFooterComponent={
						notifications.isLastPage ? (
							<View></View>
						) : (
							<ActivityIndicator size="large" color="gray" />
						)
					}
					onEndReached={endHandler}
				/>
			)}
		</SafeAreaView>
	);
}
