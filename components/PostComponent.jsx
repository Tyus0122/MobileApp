import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PhotosComponent } from "@/components/PhotosComponent";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");

export function PostComponent({ post }) {
	let images = post.files.map((file) => file.url);
	return (
		<View className='bg-white'>
			<View className="p-5">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center justify-center gap-5">
						<Image
							source={post.pic?{ uri: post.pic }:imagePlaceholder}
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
			<PhotosComponent images={images} />
			<View className="ml-5 mr-5 mb-2 flex-row items-center justify-between">
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
			<View className='bg-gray-200' style={{height:1}}>
			</View>
		</View>
	);
}
