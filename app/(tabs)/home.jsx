import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	BackHandler,
	StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
			<View className='h-screen bg-white'>
				<View>
					<NavBarComponent />
				</View>
				<ScrollView
					keyboardShouldPersistTaps={"always"}
					keyboardDismissMode="on-drag"
				>
					{loading ? (
						<View className="h-screen flex items-center justify-center">
							<ActivityIndicator size="large" color="gray" />
						</View>
					) : (
						posts.map((post, index) => (
							// <Link to={`/post/${post._id}`}>
							<PostComponent key={index} post={post} />
							// {/* </Link> */}
						))
					)}
					<View style={{ height: 100 }}></View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "grey",
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
});
