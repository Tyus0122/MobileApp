import { View, Text, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
const TabIcon = ({ icon, color, size, focused, text }) => {
	return (
		<View className="flex justify-center items-center">
			<Ionicons name={icon} size={size} color={color} />
			{focused && <Text className="text-black-500">{text}</Text>}
		</View>
	);
};

export default function tabs() {
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
		  setIsKeyboardVisible(true);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
		  setIsKeyboardVisible(false);
		});
	
		return () => {
		  keyboardDidShowListener.remove();
		  keyboardDidHideListener.remove();
		};
	  }, []);
	const ImagePermissionsandFilePermissios = async () => {
		try {
			await ImagePicker.requestCameraPermissionsAsync();
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		} catch (err) {
			console.error("Error requesting camera permissions", err);
		}
	};
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				headerShown: false,
				tabBarActiveTintColor: "black",
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					paddingBottom: 5,
					height: 60,
					display:isKeyboardVisible?'none':"block"
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={focused ? "home-sharp" : "home-outline"}
							color={color}
							size={24}
							text="Home"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="accomodation"
				options={{
					title: "accomodation",
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={focused ? "calendar-sharp" : "calendar-outline"}
							color={color}
							size={24}
							focused={focused}
							text="Hub"
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="post"
				options={{
					title: "post",
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={focused ? "add-circle-sharp" : "add-circle-outline"}
							color={color}
							size={28}
							focused={focused}
							text="Post"
						/>
					),
				}}
				listeners={() => ({
					tabPress: (e) => {
						ImagePermissionsandFilePermissios();
					},
				})}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "profile",
					tabBarIcon: ({ color, focused }) => (
						<TabIcon
							icon={focused ? "person-circle-sharp" : "person-circle-outline"}
							color={color}
							size={28}
							focused={focused}
							text="Profile"
						/>
					),
				}}
			/>
		</Tabs>
	);
}
