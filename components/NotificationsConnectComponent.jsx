import {
	View,
	Text,
	Image,
	Pressable,
	TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export function NotificationsConnectComponent({ user, index }) {
	return (
		<View
						className="pl-5 pr-5 pt-2 pb-2 ml-5 mr-5 mb-2 border border-gray-300 rounded-xl"
						key={index}
					>
						<View className="flex-row items-center gap-8 justify-between">
							<View className="flex-row items-center gap-8">
								<View>
									<Image
										source={user.pic ? { uri: user.pic.url } : imagePlaceholder}
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
								>
									<Text
										className="text-xl"
										style={{
											color: "#24A0ED",
										}}
									>
										Connect
									</Text>
								</TouchableOpacity>
								<Pressable onPress={() => setImage("")}>
									<Ionicons name={"close-outline"} size={32} color="black" />
								</Pressable>
							</View>
						</View>
					</View>
	);
}
