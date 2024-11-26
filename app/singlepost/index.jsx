import {
	View,
	Text,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { PostComponent } from "@/components/PostComponent";
import React from "react";
import { Link, router,useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { OptionsIconComponent } from "@/components/OptionsIconComponent";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const App = () => {
	const [posts, setPost] = useState([]);
	const [loading, setLoading] = useState(false);
	const params = useLocalSearchParams();
	async function fetchData() {
		setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(backend_url + "v1/user/getsinglepost?post=" + params._id, {
				headers,
			})
			.then((response) => {
				setLoading(false);
				setPost([response.data.message.posts[0]]);
			})
			.catch((err) => {
				setLoading(false);
			});
	}
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<SafeAreaView>
			<View className='bg-white h-screen'>
				<View className="flex-row p-5 items-center gap-3">
					<Pressable>
						<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
					</Pressable>
					<Text className="text-2xl">Posts</Text>
				</View>
			{loading ? (
				<View className="h-screen bg-white flex items-center justify-center">
					<ActivityIndicator size="large" color="gray" />
				</View>
			) : (
				posts?.map((post, index) => (
					<PostComponent key={index} post={post} />
				))
			)}
			</View>
		</SafeAreaView>
	);
};

export default App;
