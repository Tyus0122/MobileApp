import {
	View,
	Text,
	Image,
	Pressable,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import AsyncStorage from "@react-native-async-storage/async-storage";

export function NotificationsRequestComponent({
	user,
	index,
	notifications,
	updateNotificationState,
}) {
	const [connectionbuttonloading, setconnectionbuttonloading] = useState(false);
	async function acceptHandler() {
		try {
			setconnectionbuttonloading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: user._id,
			};
			const response = await axios.post(
				backend_url + "v1/user/acceptConnectionRequest",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				setconnectionbuttonloading(false);
				updateNotificationState({
					requests: notifications.requests.filter((item) => item._id != user._id),
				});
			}
			console.log(response.status);
			// console.log(JSON.stringify(response,null,2))
		} catch (error) {
			setconnectionbuttonloading(false);
			console.error(error.message);
		}
	}
	async function rejectHandler() {
		try {
			setconnectionbuttonloading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: user._id,
			};
			const response = await axios.post(
				backend_url + "v1/user/rejectConnectionRequest",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				setconnectionbuttonloading(false);
				updateNotificationState({
					requests: notifications.requests.filter((item) => item._id != user._id),
				});
			}
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
			<View className="flex-row items-center gap-8 justify-between">
				<View className="flex-row items-center gap-8">
					<View>
						<Image
							source={user?.pic ? { uri: user.pic.url } : imagePlaceholder}
							class
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: "black",
								borderWidth: 1.5,
							}}
						/>
					</View>
					<View>
						<Text className="text-2xl">{user.username}</Text>
						<Text className="text-gray-500 text-xl">{user.city}</Text>
					</View>
				</View>
				{connectionbuttonloading ? (
					<View
						className="border rounded-xl pl-2 pr-2 pt-1 pb-1"
						style={{
							borderColor: "#24A0ED",
						}}
					>
						<ActivityIndicator size={30} color="blue" />
					</View>
				) : (
					<View className="flex-row gap-5 items-center justify-between">
						<TouchableOpacity
							className="border rounded-xl "
							style={{
								paddingBottom: 8,
								paddingTop: 8,
								paddingLeft: 15,
								paddingRight: 15,
								borderColor: "#24A0ED",
							}}
							onPress={acceptHandler}
						>
							<Text
								className="text-xl"
								style={{
									color: "#24A0ED",
								}}
							>
								Accept
							</Text>
						</TouchableOpacity>
						<Pressable onPress={rejectHandler}>
							<Ionicons name={"close-outline"} size={32} color="black" />
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
}
