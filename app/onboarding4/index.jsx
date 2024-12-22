import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const imagePlaceholder = require("@/assets/tyuss/onboarding3.png");

export default function Onboarding2() {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
			<View className="flex-1 items-center justify-center">
				{/* Image */}
				<Image
					source={imagePlaceholder}
					style={{
						width: 350,
						height: 230,
					}}
				/>

				{/* Main Text */}
				<Text className="font-bold text-5xl mt-5 text-center">Uni Buddies</Text>

				{/* Subtext */}
				<Text
					className="font-extrabold text-2xl mt-5 text-center"
					style={{
						width: "80%",
						color: "gray",
						textAlign: "center",
					}}
				>
					Meet people with same university
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
						router.push("/onboarding5");
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
