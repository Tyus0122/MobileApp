import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export function Notifications7Days({ item, index }) {
	return (
		<View
			key={index}
			className="pl-2 pr-2 pt-2 pb-2 ml-5 mr-5 mb-2 border flex-row items-center justify-between border-gray-300 rounded-xl"
		>
			<View className="flex-row items-center gap-3">
				<View>
					<Image
						source={item.userPic ? { uri: item.userPic.url } : imagePlaceholder}
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
				<View className="flex-row items-center gap-3">
					<Text className="text-xl">
						{item.notification.length > 30
							? item.notification.substring(0, 25) + "..."
							: item.notification}
					</Text>
					<Text className="text-gray-500 text-xl">{item.time}</Text>
				</View>
			</View>
			<View>
				<Image
					source={item.pic ? { uri: item.pic.url } : imagePlaceholder}
					class
					style={{
						width: 60,
						height: 60,
						borderRadius: 15,
						borderColor: "black",
						borderWidth: 1.5,
					}}
				/>
			</View>
		</View>
	);
}
