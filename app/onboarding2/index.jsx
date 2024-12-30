import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RouterStore } from "expo-router/build/global-state/router-store";

const imagePlaceholder = require("@/assets/tyuss/onboarding2.png");

export default function Onboarding2() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
			<View className="flex-row p-5 items-center justify-between gap-3 m-5">
				<Pressable onPress={() => router.back()}>
					<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
				</Pressable>
				<Pressable
					className="items-end"
					onPress={() => router.push("onboarding5")}
				>
					<Text className="text-blue-500 text-2xl mr-5">Skip</Text>
				</Pressable>
			</View>
			<View className="flex-1 items-center justify-center">
				{/* Image */}
				<Image
					source={imagePlaceholder}
					style={{
						width: 350,
						height: 300,
					}}
				/>

				{/* Main Text */}
				<Text className="font-bold text-5xl mt-5 text-center">Find Home</Text>

				{/* Subtext */}
				<Text
					className="font-extrabold text-2xl mt-5 text-center text-gray-600"
					style={{
						width: "80%",
						textAlign: "center",
						color: "gray",
					}}
				>
					You can find a place where you can meet a family of your choice.
				</Text>

				{/* Progress Indicators */}
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
							backgroundColor: "blue",
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
							backgroundColor: "gray",
							borderRadius: 6,
						}}
					/>
				</View>

				{/* Button */}
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
						router.push("/onboarding3");
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
