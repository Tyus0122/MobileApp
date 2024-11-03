import { View, Text, Image, Pressable } from "react-native";
import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PhotosComponent } from "@/components/PhotosComponent";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";

export function PostComponent({
	post,
	setModalVisible,
	handleSnapPress,
	modalVisible,
}) {
	let images = post.files.map((file) => file.url);
	const [like, setLike] = useState(post.liked);
	const [likeCount, setLikeCount] = useState(post.likescount);
	async function postlikeHandler(data) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const body = {
			liked: data,
			post_id: post._id,
		};
		const response = await axios.post(backend_url + "v1/user/likePost", body, {
			headers,
		});
	}
	const debounceCallLike = useCallback(
		debounce((data) => postlikeHandler(data), debounce_time),
		[]
	);
	return (
		<View className="bg-white">
			<View className="p-5">
				<View className="flex-row items-center justify-between">
					<Pressable
						className="flex-row items-center justify-center gap-5"
						onPress={() => {
							router.push({
								pathname: "/userProfile",
								params: { _id: post.posted_by_id },
							});
						}}
					>
						<Image
							source={post.pic ? { uri: post.pic } : imagePlaceholder}
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
								borderColor: "black",
								borderWidth: 1.5,
							}}
						/>
						<View>
							<Text className="text-xl font-medium">{post.posted_by}</Text>
							<Text>{post.posted_by_city}</Text>
						</View>
					</Pressable>
					<View>
						<Ionicons name={"ellipsis-vertical-outline"} size={24} />
					</View>
				</View>
				<View className="mt-3">
					<Text style={{ textAlign: "center" }}>{post.caption}</Text>
				</View>
			</View>
			<PhotosComponent images={images} _id={post._id} />
			<View className="ml-5 mr-5 mb-2 flex-row items-center justify-between">
				<View
					className="flex-row items-center justify-between"
					style={{
						width: "25%",
					}}
				>
					<Pressable
						onPress={() => {
							if (like) {
								setLikeCount(likeCount - 1);
							} else {
								setLikeCount(likeCount + 1);
							}
							setLike(!like);
							debounceCallLike(!like);
						}}
					>
						<Ionicons
							name={like ? "heart" : "heart-outline"}
							size={24}
							color={like ? "red" : "black"}
						/>
					</Pressable>
					<Pressable
						onPress={() => {
							setModalVisible(true);
							handleSnapPress(0);
						}}
					>
						<Ionicons name={"chatbubble-outline"} size={24} />
					</Pressable>
					<Ionicons name={"paper-plane-outline"} size={24} />
				</View>
				<View>
					<Ionicons name={"bookmark-outline"} size={24} />
				</View>
			</View>
			<View className="pl-5">
				<Text className="text-lg font-semibold">{likeCount} likes</Text>
				<Text className="text-lg text-gray-500">
					view {post.commentscount} comments
				</Text>
				<Text className="text-lg text-gray-500">{post.post_date}</Text>
			</View>
			<View className="bg-gray-200" style={{ height: 1 }}></View>
		</View>
	);
}
