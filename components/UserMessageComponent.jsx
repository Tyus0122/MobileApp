import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend_url } from "@/constants/constants";
import axios from "axios";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
export function UserMessageComponent({ user }) {
	return (
		<View>
			<View className="pl-5 pr-5 pt-2 pb-2 m-1 w-[80%]  border border-gray-200 rounded-xl flex-row items-center justify-between">
				<View className="flex-row items-center gap-8">
					<View>
						<Image
							source={user.pic && user.pic.url ? { uri: user.pic.url } : imagePlaceholder}
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
					<View className='flex-row w-[80%] items-center justify-between'>
						<View>
							<Text className="text-xl">{user.username}</Text>
							<Text className="text-gray-500">{user.lastMessage}</Text>
						</View>
						<View>
							<Text>
								{user.lastMessageTime}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}
