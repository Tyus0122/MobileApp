import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	RefreshControl,
	ActivityIndicator,
	BackHandler,
	FlatList,
} from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
export function CommentComponent({
	item,
	index,
	openKeyboard,
	commentState,
	showRepliestext = true,
	parent_comment_id = "not-provided",
}) {
	if (parent_comment_id == "not-provided") {
		parent_comment_id = item._id;
	}
	const [liked, setliked] = useState(item.liked);
	const [likes, setLikes] = useState(item.likes);
	const [show, setShow] = useState(false);
	const [page, setPage] = useState(0);
	const [replies, setReplies] = useState([]);
	const [isLastpage, setIsLastPage] = useState(false);
	const [loading, setLoading] = useState(false);
	async function commentlikeHandler(data) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const body = {
			liked: data,
			comment_id: item._id,
		};
		const response = await axios.post(
			backend_url + "v1/user/likeComment",
			body,
			{
				headers,
			}
		);
	}
	const debounceCallComment = useCallback(
		debounce((data) => commentlikeHandler(data), debounce_time),
		[]
	);

	async function getReplies(commentId) {
		if(page==0)setLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const response = await axios.get(
			backend_url +
				"v1/user/getCommentReplies?commentId=" +
				commentId +
				"&postId=" +
				commentState.currentPostId +
				"&page=" +
				page,
			{
				headers,
			}
		);
		if(page==0)setLoading(false);
		setReplies([...replies, ...response.data.comments]);
		setIsLastPage(response.data.isLastPage);
		setPage(page + 1);
	}
	async function showReplies(commentId) {
		if (page == 0) {
			getReplies(commentId);
		}
		setShow(!show);
	}
	return (
		<View className="mt-2" key={index}>
			<View className="flex-row justify-between pr-5 pl-5 border border-gray-300 rounded-lg ">
				<View className="flex-row gap-5 mt-2">
					<Image
						source={item.pic ? { uri: item.pic.url } : imagePlaceholder}
						class
						style={{
							width: 50,
							height: 50,
							borderRadius: 50,
							borderColor: "black",
							borderWidth: 1.5,
						}}
					/>
					<View>
						<View className="flex-row gap-3 items-center justify-center">
							<Text className="text-2xl font-semibold">{item.name}</Text>
							<Text>{item.time}</Text>
						</View>
						<Text className="text-xl text-gray-500">{item.city}</Text>
						<Text className="text-xl">{item.comment}</Text>
						<TouchableOpacity
							onPress={() => {
								openKeyboard(parent_comment_id);
							}}
							className="p-1"
						>
							<Text className="text-black-900 font-semibold">Reply</Text>
						</TouchableOpacity>
						{showRepliestext ? (
							<View>
								<Pressable
									onPress={() =>
										!show ? showReplies(parent_comment_id) : setShow(!show)
									}
									className="p-2"
								>
									<Text className="text-black-900 font-semibold">
										{!show ? "show" : "hide"} replies
									</Text>
								</Pressable>
							</View>
						) : (
							<View></View>
						)}
					</View>
				</View>
				<Pressable
					className="flex items-center justify-center"
					onPress={() => {
						if (liked) {
							setLikes(likes - 1);
						} else {
							setLikes(likes + 1);
						}
						setliked(!liked);
						debounceCallComment(!liked);
					}}
				>
					<Ionicons
						name={`${liked ? "thumbs-up" : "thumbs-up-outline"}`}
						size={24}
						color="black"
					/>
					<Text>{likes || 0}</Text>
				</Pressable>
			</View>
			{show &&
				(loading ? (
					<ActivityIndicator size="small" color="black" />
				) : (
					<View>
						{replies.map((reply, index) => (
							<View className="pl-5 pr-5">
								<CommentComponent
									item={reply}
									index={index}
									openKeyboard={openKeyboard}
									commentState={commentState}
									showRepliestext={false}
									parent_comment_id={item._id}
								/>
							</View>
						))}
						{!isLastpage && (
							<Pressable
								className="flex-row justify-center mt-5"
								onPress={() => {
									getReplies(parent_comment_id);
								}}
							>
								<Text className="text-black-900 font-semibold">
									Load more Replies
								</Text>
							</Pressable>
						)}
					</View>
				))}
		</View>
	);
}
