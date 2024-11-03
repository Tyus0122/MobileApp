import { View, Text, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export function NavBarComponent() {
	return (
		<View>
			<View className="h-[60px] flex-row items-center justify-between pl-3 pr-5">
				<View className="flex-1">
					<Image source={require("@/assets/tyuss/MLogo.png")} />
				</View>
				<View className="flex1 w-[140px]"></View>
				<View className="flex-1 flex-row items-center justify-between">
					<Ionicons name={"help-circle-sharp"} size={34} />
					<Ionicons name={"notifications-outline"} size={34} />
					<Link href={"/messages"}>
						<Ionicons name={"chatbox-ellipses"} size={34} />
					</Link>
				</View>
			</View>
			<View className="bg-gray-300 h-[2px] "></View>
		</View>
	);
}
