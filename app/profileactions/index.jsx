import {
	View,
	Text,
	Pressable,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
	async function logoutHandler() {
		await AsyncStorage.removeItem("BearerToken");
		router.push("/");
	}

	const options = [
		{ label: "Saved", link: "/saved", icon: "bookmark-outline" },
		{
			label: "Password and Security",
			link: "/changePassword",
			icon: "lock-closed-outline",
		},
		{ label: "Settings", link: "/changePassword", icon: "settings-outline" },
		{ label: "Help Center", link: "/help", icon: "help-circle-outline" },
		{ label: "Blocked", link: "/blocked", icon: "ban-outline" },
		{ label: "Privacy Center", link: "/privacy", icon: "shield-outline" },
	];

	return (
		<SafeAreaView className="bg-white flex-1">
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				keyboardDismissMode="on-drag"
			>
				{/* Close Icon */}
				<View className="items-end m-5">
					<Pressable onPress={() => router.back()}>
						<Ionicons name={"close-outline"} size={28} color="gray" />
					</Pressable>
				</View>
				<View className="p-[10%] flex-row flex-wrap justify-between ">
					{options.map((value, key) => (
						<Pressable
							className="w-[40%] border border-gray-300 rounded-lg p-4 mb-5 flex-row items-center justify-center"
							key={key}
							onPress={() => router.push(value.link)}
						>
							<View className="gap-5 items-center justify-center">
								<Ionicons name={value.icon} size={50} color="gray" />
								<Text className="text-lg font-semibold text-gray-600">
									{value.label}
								</Text>
							</View>
						</Pressable>
					))}
					<TouchableOpacity
						onPress={logoutHandler}
						className="w-[40%] border border-gray-300 rounded-lg p-4 mb-5 flex-row items-center justify-center"
					>
						<View className="items-center justify-center">
							<Ionicons name={"log-out-outline"} size={50} color="gray" />
							<Text className="text-lg font-semibold text-gray-600">
								Sign Out
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
