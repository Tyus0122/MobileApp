import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	RefreshControl,
	TouchableOpacity,
	Image,
	Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend_url } from "@/constants/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
const EVENTSPlaceholder = require("@/assets/tyuss/events.png");
export default function Saved() {
	// State management
	const [posts, setPosts] = useState([]); // Stores fetched posts
	const [loading, setLoading] = useState(false); // Indicates initial data loading
	const [isLastPage, setIsLastPage] = useState(false); // Indicates if it's the last page
	const [page, setPage] = useState(0); // Tracks current page for pagination
	const [refresh, setRefresh] = useState(false); // Manages pull-to-refresh

	// Fetch data function
	async function fetchData({ mode = "default", pageNumber = 0 }) {
		if (mode === "default" && pageNumber === 0) {
			setLoading(true); // Show loader for initial fetch
		}

		try {
			// Get the Bearer token from AsyncStorage
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			// Fetch posts from the backend
			const response = await axios.get(
				`${backend_url}v1/user/getSavedPosts?page=${pageNumber}`,
				{ headers }
			);

			const fetchedPosts = response.data.posts || [];
			const isEnd = fetchedPosts.length === 0;

			// Update state based on the mode
			if (mode === "refresh") {
				setPosts(fetchedPosts); // Replace posts on refresh
			} else {
				setPosts((prev) => [...prev, ...fetchedPosts]); // Append posts for pagination
			}
			setIsLastPage(isEnd); // Set last page indicator
		} catch (error) {
			console.error("Error fetching posts:", error.message);
		} finally {
			if (mode === "default" && pageNumber === 0) {
				setLoading(false); // Hide loader for initial fetch
			}
			if (mode === "refresh") {
				setRefresh(false); // End refresh animation
			}
		}
	}

	// Handle pull-to-refresh
	async function refreshHandler() {
		setRefresh(true); // Start refresh animation
		setPage(0); // Reset page to 0
		await fetchData({ mode: "refresh", pageNumber: 0 }); // Fetch fresh data
	}

	// Handle pagination when reaching the end
	async function endHandler() {
		if (!isLastPage && !loading) {
			const nextPage = page + 1;
			setPage(nextPage); // Increment page
			await fetchData({ mode: "default", pageNumber: nextPage }); // Fetch next page
		}
	}

	// Fetch initial data on component mount
	useEffect(() => {
		fetchData({ mode: "default", pageNumber: 0 });
	}, []);

	// Render each post item
	function renderPost({ item }) {
		return (
			<Pressable
				className=" m-2"
				key={item._id}
				onPress={() => {
					router.push({
						pathname: "/singlepost",
						params: {
							_id: item._id,
						},
					});
				}}
			>
				<Image
					source={item.files ? { uri: item.files.url } : EVENTSPlaceholder}
					style={{
						width: 200,
						height: 200,
						borderRadius: 10,
					}}
				/>
			</Pressable>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{loading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="gray" />
				</View>
			) : (
				<FlatList
					data={posts}
					keyExtractor={(item, index) => index.toString()}
					numColumns={2} // Two items per row
					renderItem={renderPost} // Function to render each item
					refreshControl={
						<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />
					}
					ListHeaderComponent={() => (
						<Pressable className="flex-row p-5 items-center gap-3" onPress={() => router.back()}>
							<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
							<Text className="text-2xl">Saved</Text>
						</Pressable>
					)}
					onEndReached={endHandler}
					ListFooterComponent={() =>
						isLastPage ? (
							<Text className="text-center text-gray-500 py-4">
								You have reached the end.
							</Text>
						) : (
							<ActivityIndicator size="large" color="gray" className="py-4" />
						)
					}
				/>
			)}
		</SafeAreaView>
	);
}
