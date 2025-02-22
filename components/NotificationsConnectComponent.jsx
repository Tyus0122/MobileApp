import {
	View,
	Text,
	Image,
	Pressable,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { backend_url } from "@/constants/constants";
import { router } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import AsyncStorage from "@react-native-async-storage/async-storage";

export function NotificationsConnectComponent({
	user,
	index,
	notifications,
	updateNotificationState,
}) {
	const [connectionbuttonloading, setconnectionbuttonloading] = useState(false);

	async function connectHandler() {
		try {
			setconnectionbuttonloading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: user._id,
				send: true,
			};
			const response = await axios.post(
				backend_url + "v1/user/sendConnectionRequest",
				data,
				{
					headers,
				}
			);
			if (response.status === 200) {
				setconnectionbuttonloading(false);
				updateNotificationState({
					suggestions: notifications.suggestions.filter(
						(item) => item._id !== user._id
					),
				});
			}
		} catch (error) {
			setconnectionbuttonloading(false);
			console.error(error.message);
		}
	}

	async function rejectHandler() {
		try {
			updateNotificationState({
				suggestions: notifications.suggestions.filter(
					(item) => item._id !== user._id
				),
			});
		} catch (error) {
			setconnectionbuttonloading(false);
			console.error(error.message);
		}
	}

	return (
		<View
			className="pl-5 pr-5 pt-2 pb-2 ml-5 mr-5 mb-2 border border-gray-300 rounded-xl"
			key={index}
		>
			<View className="flex-row items-center justify-between">
				<TouchableOpacity
					className="flex-row items-center gap-4 flex-1"
					onPress={() => {
						router.push({
							pathname: "/userProfile",
							params: { _id: user._id },
						});
					}}
				>
					<Image
						source={user.pic ? { uri: user.pic.url } : imagePlaceholder}
						style={{
							width: 50,
							height: 50,
							borderRadius: 50,
							borderColor: "black",
							borderWidth: 1.5,
						}}
					/>
					<View>
						<Text className="text-base font-semibold">{user.username}</Text>
						<Text className="text-gray-500 text-sm">{user.city}</Text>
					</View>
				</TouchableOpacity>

				{connectionbuttonloading ? (
					<ActivityIndicator size="small" color="blue" />
				) : (
					<View className="flex-row gap-4 items-center">
						<TouchableOpacity
							className="border rounded-lg px-4 py-2 border-blue-500"
							onPress={connectHandler}
						>
							<Text className="text-blue-500 text-sm font-semibold">
								Connect
							</Text>
						</TouchableOpacity>
						<Pressable
							onPress={rejectHandler}
							className="p-2 bg-gray-200 rounded-full"
						>
							<Ionicons name="close-outline" size={24} color="black" />
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
}
