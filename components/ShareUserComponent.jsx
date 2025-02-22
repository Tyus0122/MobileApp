import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export function ShareUserComponent({ user }) {
	// State to track if the user is selected
	const [isSelected, setIsSelected] = useState(false);

	// Handler to toggle the selection state
	const handleSelect = () => {
		setIsSelected((prev) => !prev);
	};

	return (
		<TouchableOpacity onPress={handleSelect}>
			<View
				className={`pl-5 pr-5 pt-2 pb-2 m-1 border ${
					isSelected ? "border-blue-500" : "border-gray-200"
				} rounded-xl flex-row items-center justify-between`}
			>
				<View className="flex-row items-center gap-8">
					<View>
						<Image
							source={user.pic ? { uri: user.pic.url } : imagePlaceholder}
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: isSelected ? "blue" : "black",
								borderWidth: 1.5,
							}}
						/>
					</View>
					<View>
						<Text className="text-base">{user.username}</Text>
						<Text className="text-gray-500">{user.city}</Text>
					</View>
				</View>
				<View>
					<Ionicons
						name={isSelected ? "checkmark-circle" : "ellipse-outline"}
						size={24}
						color={isSelected ? "blue" : "gray"}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
}
