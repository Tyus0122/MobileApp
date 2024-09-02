import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export function PostComponent({ post }) {
	console.log(post);
	return (
		<View>
			<View className="p-5">
				<View className="flex-row items-center justify-between">
					<View
						className="flex-row items-center justify-center gap-5"
					>
						<Image
							source={{uri:post.pic}}
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
					</View>
					<View>
						<Ionicons name={"ellipsis-vertical-outline"} size={24} />
					</View>
				</View>
				<View className="mt-3">
					<Text style={{ textAlign: "center" }}>{post.caption}</Text>
				</View>
			</View>
			<View className="flex items-center justify-center">
				<Image
					source={{uri:post.photo}}
					style={{
						width: "90%",
						height: 200,
					}}
				/>
			</View>
			<View className="p-5 flex-row items-center justify-between">
				<View
					className="flex-row items-center justify-between"
					style={{
						width: "25%",
					}}
				>
					<Ionicons
						name={post.liked ? "heart" : "heart-outline"}
						size={24}
						color={post.liked ? "red" : "black"}
					/>
					<Ionicons name={"chatbubble-outline"} size={24} />
					<Ionicons name={"paper-plane-outline"} size={24} />
				</View>
				<View>
					<Ionicons name={"bookmark-outline"} size={24} />
				</View>
			</View>
			<View className="pl-5">
				<Text className="text-lg font-semibold">{post.likescount} likes</Text>
				<Text className="text-lg text-gray-500">
					view {post.commentscount} comments
				</Text>
				<Text className="text-lg text-gray-500">{post.post_date}</Text>
			</View>
		</View>
	);
}
