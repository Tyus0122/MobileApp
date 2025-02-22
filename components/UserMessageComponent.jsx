import { View, Text, Image } from "react-native";
import React from "react";

const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export function UserMessageComponent({ user }) {
	return (
		<View className="pl-5 pr-5 pt-2 pb-2 m-1 w-[95%] border border-gray-200 rounded-xl">
			<View className="flex-row items-center justify-between">
				{/* Profile Image */}
				<Image
					source={user.pic && user.pic.url ? { uri: user.pic.url } : imagePlaceholder}
					style={{
						width: 50,
						height: 50,
						borderRadius: 50,
						borderColor: "black",
						borderWidth: 1.5,
					}}
				/>

				{/* Username & Last Message */}
				<View className="flex-1 ml-4 pr-3">
					<Text className="text-base font-semibold">{user.username}</Text>
					<Text className="text-gray-500 flex-shrink">{user.lastMessage}</Text>
				</View>

				{/* Last Message Time */}
				<Text className="text-gray-400 text-sm">{user.lastMessageTime}</Text>
			</View>
		</View>
	);
}
