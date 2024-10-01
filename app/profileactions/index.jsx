import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	BackHandler,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import PhoneInput from "react-native-phone-input";
import { OptionsIconComponent } from "@/components/OptionsIconComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Profile() {
	const params = useLocalSearchParams();
	async function logoutHandler() {
		await AsyncStorage.removeItem("BearerToken");
		router.push("/");
	}
	const options = [
		{
			label: "Saved",
			link: "/saved",
		},
		{
			label: "Muted Accouts",
			link: "/saved",
		},
		{
			label: "Settings",
			link: "/saved",
		},
		{
			label: "Country and Language",
			link: "/saved",
		},
		{
			label: "Password and Security",
			link: "/saved",
		},
		{
			label: "Blocked",
			link: "/saved",
		},
		{
			label: "Help Center",
			link: "/saved",
		},
		{
			label: "Privacy Center",
			link: "/saved",
		},
		{
			label: "Terms",
			link: "/saved",
		},
		{
			label: "About",
			link: "/saved",
		},
	];
	return (
		<SafeAreaView>
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				keyboardDismissMode="on-drag"
			>
				<View className="h-screen bg-white">
					<View className="items-end m-5 p-3">
						<Pressable onPress={() => router.back()}>
							<Ionicons name={"close-outline"} size={28} color="gray" />
						</Pressable>
					</View>
					<View className="p-5 m-5 gap-8">
						{options.map((value, key) => (
							<View className="flex-row items-center justify-between" key={key}>
								<Text className="text-2xl font-semibold text-gray-500">
									{value.label}
								</Text>
								<Ionicons
									name={"chevron-forward-outline"}
									size={28}
									color="gray"
								/>
							</View>
						))}
						<TouchableOpacity onPress={logoutHandler}>
							<View className="flex-row items-center justify-between">
								<Text className="text-2xl font-semibold text-gray-500">
									Sign Out
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
