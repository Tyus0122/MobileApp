import React,{useState} from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const imagePlaceholder = require("@/assets/tyuss/onboarding5.png");

export default function Onboarding2() {
	async function redirectSignup() {
		await AsyncStorage.setItem("is_onboarded", "yes");
		router.push("/signup");
	}
	async function redirectLogin() {
		await AsyncStorage.setItem("is_onboarded", "yes");
		router.push("/login");
	}
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
			<View className="flex-row p-5 items-center justify-between gap-3 m-5">
				<Pressable onPress={() => router.back()}>
					<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
				</Pressable>
			</View>
			<View className="flex-1 items-center justify-center">
				<Image
					source={imagePlaceholder}
					style={{
						width: 350,
						height: 230,
					}}
				/>
				<Text className="font-bold text-5xl mt-5 text-center">Help</Text>
				<Text
					className="font-extrabold text-base mt-5 text-center"
					style={{
						width: "80%",
						color: "gray",
						textAlign: "center",
					}}
				>
					Instant Help 24/7
				</Text>
				<View
					className="flex-row justify-center"
					style={{
						gap: 8,
						marginTop: 30,
					}}
				>
					<View
						style={{
							width: 12,
							height: 12,
							backgroundColor: "gray",
							borderRadius: 6,
						}}
					/>
					<View
						style={{
							width: 12,
							height: 12,
							backgroundColor: "gray",
							borderRadius: 6,
						}}
					/>
					<View
						style={{
							width: 12,
							height: 12,
							backgroundColor: "gray",
							borderRadius: 6,
						}}
					/>
					<View
						style={{
							width: 12,
							height: 12,
							backgroundColor: "blue",
							borderRadius: 6,
						}}
					/>
				</View>
				{/* <Pressable
					className="rounded-full flex-row gap-4 items-center justify-center"
					style={{
						backgroundColor: "#000435",
						width: "80%",
						marginTop: "30%",
						paddingBottom: 20,
						paddingTop: 20,
					}}
					onPress={() => {
						redirectSignup();
					}}
				>
					<Text className="text-base text-white">Sign up</Text>
					<Ionicons name={"arrow-forward-outline"} size={28} color={"white"} />
				</Pressable>
				<View className="flex-row items-center justify-center mt-2">
					<Text className="text-base">Already have an account?</Text>
					<Pressable
						onPress={() => {
							redirectLogin();
						}}
					>
						<Text className="text-base text-blue-500">Login</Text>
					</Pressable>
				</View> */}
				<Pressable
					style={{
						backgroundColor: "#000435",
						borderRadius: 30,
						marginTop: 50,
						paddingVertical: 15,
						paddingHorizontal: 20,
						flexDirection: "row",
						alignItems: "center",
					}}
					onPress={() => {
						router.push("/terms");
					}}
				>
					<Ionicons
						name={"chevron-forward-outline"}
						size={28}
						color={"white"}
					/>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
