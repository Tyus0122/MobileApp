import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const imagePlaceholder = require("@/assets/tyuss/onboarding1.png");
import { Link, router } from "expo-router";

export default function Onboarding1() {
	return (
		<SafeAreaView>
			<View className="flex-row items-center justify-center h-screen bg-white">
				<View className=" justify-center items-center ">
					<Image
						className="mb-5"
						source={imagePlaceholder}
						style={{
							width: 350,
							height: 350,
						}}
					/>
					<Text className="font-extrabold text-5xl mt-5">Welcome</Text>
					<Pressable
						className="rounded-full flex items-center justify-center"
						style={{
							backgroundColor: "#000435",
							width: "80%",
							marginTop: "30%",
							paddingBottom: 20,
							paddingTop: 20,
						}}
						onPress={() => {
							router.push("/onboarding2");
						}}
					>
						<Text className="text-3xl text-white">Let's begin</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
