import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
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
	updateCommentState,
	modalVisible,
	inicomments,
	ehandleSnapPress,
	eModalVisible,
	seteModalVisible,
	shareModalVisible,
	setShareModalVisible,
	sharehandleSnapPress,
}) {
	let images = post.files.map((file) => file.url);
	const [like, setLike] = useState(post.liked);
	const [likeCount, setLikeCount] = useState(post.likescount);
	const [saved, setSaved] = useState(post.saved);
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
	async function postSaveHandler(data) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const body = {
			saved: data,
			post_id: post._id,
		};
		const response = await axios.post(backend_url + "v1/user/savePost", body, {
			headers,
		});
	}
	const debounceCallSave = useCallback(
		debounce((data) => postSaveHandler(data), debounce_time),
		[]
	);
	async function fetchComments() {
		updateCommentState({
			allcomments: inicomments[post._id].comments.comments,
			isLastPage: inicomments[post._id].comments.isLastPage,
			page: 0,
		});
	}
	return (
		<View className={`{${modalVisible ? "bg-gray-300" : "bg-white"}}`}>
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
					<Pressable
						onPress={() => {
							handleSnapPress(-1);
							sharehandleSnapPress(-1);
							updateCommentState({
								currentPostId: post._id,
								currentUserId: post.posted_by_id,
							});
							seteModalVisible(true);
							ehandleSnapPress(0);
						}}
					>
						<Ionicons name={"ellipsis-vertical-outline"} size={24} />
					</Pressable>
				</View>
				<View className="mt-3">
					<Text style={{ textAlign: "center" }}>{post.caption}</Text>
				</View>
			</View>
			<PhotosComponent images={images} _id={post._id} />
			<View className="ml-5 mr-5 mb-2 flex-row items-center justify-between">
				<View
					className="flex-row items-center gap-3"
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
							debounceCallLike(!like);
							setLike(!like);
						}}
					>
						<Ionicons
							name={like ? "heart" : "heart-outline"}
							size={24}
							color={like ? "red" : "black"}
						/>
					</Pressable>
					{!post.turn_off_comments && (
						<Pressable
							onPress={() => {
								updateCommentState({
									currentPostId: post._id,
									currentUserId: post.posted_by_id,
								});
								fetchComments();
								setModalVisible(true);
								handleSnapPress(0);
							}}
						>
							<Ionicons name={"chatbubble-outline"} size={24} />
						</Pressable>
					)}
					<Pressable
						onPress={() => {
							updateCommentState({
								currentPostId: post._id,
								currentUserId: post.posted_by_id,
							});

							// fetchComments();
							setShareModalVisible(true);
							sharehandleSnapPress(0);
						}}
					>
						<Ionicons name={"paper-plane-outline"} size={24} />
					</Pressable>
				</View>
				<Pressable
					onPress={() => {
						setSaved(!saved);
						debounceCallSave(!saved);
					}}
				>
					<Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={24} />
				</Pressable>
			</View>
			<View className="pl-5">
				<Text className="text-lg font-semibold">{likeCount} likes</Text>
				{!post.turn_off_comments && (
					<Text className="text-lg text-gray-500">
						view {post.commentscount} comments
					</Text>
				)}
				<Text className="text-lg text-gray-500">{post.post_date}</Text>
				<View className="flex-row items-center justify-start">
					<Text className="text-xl text-gray-500 font-semibold">place:</Text>
					<Text className="text-lg text-gray-500">{post.post_place}</Text>
				</View>
			</View>
			<View className="bg-gray-200" style={{ height: 1 }}></View>
		</View>
	);
}
