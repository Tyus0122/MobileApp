import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ScrollView,
	ActivityIndicator,
	BackHandler,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { useState, useEffect } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Home() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	function handleBackPress() {
		BackHandler.exitApp();
		return true;
	}
	useFocusEffect(
		React.useCallback(() => {
			BackHandler.addEventListener("hardwareBackPress", handleBackPress);
			return () => {
				BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
			};
		})
	);
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			axios
				.get(backend_url + "v1/user/getposts", { headers })
				.then((response) => {
					setPosts(response.data.message.posts);
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
				});
		}
		fetchData();
	}, []);
	return (
		<SafeAreaView>
			<View className="bg-white">
				<NavBarComponent />
			</View>
			<ScrollView keyboardShouldPersistTaps={"always"}>
				{loading ? (
					<View className="h-screen bg-white flex items-center justify-center">
						<ActivityIndicator size="large" color="gray" />
					</View>
				) : (
					posts.map((post, index) => (
						// <Link to={`/post/${post._id}`}>
						<PostComponent key={index} post={post} />
						// {/* </Link> */}
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
