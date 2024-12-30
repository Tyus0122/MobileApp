import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useSegments, router } from "expo-router";

export function NavBarComponent() {
	const segments = useSegments();
	const pathname = segments.join("/");
	return (
		<View>
			<View className="h-[60px] flex-row items-center justify-between pl-3 pr-5">
				<View className="flex-1">
					<Pressable
						onPress={() => {
							if (pathname != "(tabs)/home") {
								router.push("(tabs)/home");
							}
						}}
					>
						<Text className='text-black text-2xl'>Friendzy</Text>
					</Pressable>
				</View>
				<View className="flex1 w-[140px]"></View>
				<View className="flex-1 flex-row items-center justify-between">
					<Link href={"/help"}>
						<Ionicons name={"help-circle-sharp"} size={34} />
					</Link>
					<Link href={"/notifications"}>
						<Ionicons name={"notifications-outline"} size={34} />
					</Link>
					<Link href={"/messages"}>
						<Ionicons name={"chatbox-ellipses"} size={34} />
					</Link>
				</View>
			</View>
			<View className="bg-gray-300 h-[2px] "></View>
		</View>
	);
}
