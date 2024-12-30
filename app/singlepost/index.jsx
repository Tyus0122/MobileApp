import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	RefreshControl,
	ActivityIndicator,
	BackHandler,
	FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PostComponent } from "@/components/PostComponent";
import { NavBarComponent } from "@/components/NavBarComponent";
import { CommentComponent } from "@/components/CommentComponent";
import { useState, useCallback, useEffect, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { debounce } from "lodash";
export default function singlePost() {
	const params = useLocalSearchParams();
	const sheetRef = useRef(null);
	const shareSheetRef = useRef(null);
	const [shareModalVisible, setShareModalVisible] = useState(false);
	const shareSnapPoints = ["80%"];
	const eSheetRef = useRef(null);
	const [eModalVisible, seteModalVisible] = useState(false);
	const eSnapPoints = ["40%"];
	const inputRef = useRef(null);
	const snapPoints = ["80%"];
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [isLastPage, setIsLastPage] = useState(false);
	const [page, setPage] = useState(0);
	const [inicomments, setInicomments] = useState({});
	const [loggedInUser, setLoggedInUser] = useState({
		pic: "",
	});
	const [commentState, setCommentState] = useState({
		allcomments: [],
		currentPostId: "",
		commentsLoading: false,
		isLastPage: true,
		page: 0,
		comment: "",
		parent_comment_id: "",
		currentUserId: "",
	});
	function updateCommentState(newState) {
		setCommentState((prevState) => ({ ...prevState, ...newState }));
	}
	const [userstate, setUserstate] = useState({
		usersList: [],
		selected_ids: [],
		searchString: "",
		page: 0,
		isLastPage: false,
		Loading: false,
		page_limit: 0,
	});
	function updateuserstate(newState) {
		setUserstate((prevState) => ({ ...prevState, ...newState }));
	}
	const debounceCallSearch = useCallback(
		debounce((data) => {
			fetchusersData(0, data);
		}, debounce_time),
		[]
	);
	const [refresh, setRefresh] = useState(false);
	function handleBackPress() {
		if (modalVisible || eModalVisible || shareModalVisible) {
			setModalVisible(false);
			setCommentState({
				...commentState,
				allcomments: [],
				currentPostId: "",
			});
			seteModalVisible(false);
			setShareModalVisible(false);
			setUserstate({
				usersList: [],
				selected_ids: [],
				searchString: "",
				page: 0,
				isLastPage: false,
				loading: false,
			});
			return true;
		}
	}
	useFocusEffect(
		React.useCallback(() => {
			BackHandler.addEventListener("hardwareBackPress", handleBackPress);
			return () => {
				BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
			};
		})
	);
	async function refreshHandler() {
		setRefresh(true);
		await fetchData({ mode: "refresh" });
		setRefresh(false);
	}
	async function fetchData({ page = 0, mode = "normal" }) {
		if (page == 0) {
			setPage(0);
			setLoading(true);
		}
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
				if (response.data.message.selfPost) {
					router.back();
					router.push({
						pathname: "/myPosts",
						params: {
							_id: response.data.message.posts[0]._id,
						},
					});
				} else {
					if (mode == "refresh" || page == 0) {
						setPosts(response.data.message.posts);
						setInicomments(response.data.message.comments);
					} else {
						setPosts([...posts, ...response.data.message.posts]);
						setInicomments({
							...inicomments,
							...response.data.message.comments,
						});
					}
					updateuserstate({
						usersList: response.data.message.shareUsers,
						isLastPage: response.data.message.shareIsLastPage,
						page_limit: response.data.message.sharePageLimit,
					});
					setLoggedInUser({
						...loggedInUser,
						pic: response.data.message.logged_in_user.pic,
					});
					setIsLastPage(response.data.message.isLastPage);
					if (page == 0) setLoading(false);
				}
			})
			.catch((err) => {
				if (page == 0) setLoading(false);
			});
	}
	useEffect(() => {
		fetchData({});
		const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
			updateCommentState({ parent_comment_id: "" });
			// Your custom logic here
		});

		// Clean up the listener on unmount
		return () => {
			keyboardListener.remove();
		};
	}, []);

	const handleSnapPress = useCallback((index) => {
		if (index === -1) setModalVisible(false);
		sheetRef.current?.snapToIndex(index);
	}, []);
	const sharehandleSnapPress = useCallback((index) => {
		if (index === -1) setShareModalVisible(false);
		shareSheetRef.current?.snapToIndex(index);
	}, []);
	const ehandleSnapPress = useCallback((index) => {
		if (index === -1) seteModalVisible(false);
		eSheetRef.current?.snapToIndex(index);
	}, []);
	async function endHandler() {
		if (!isLastPage) {
			setPage(page + 1);
			fetchData({ page: page + 1 });
		}
	}

	const openKeyboard = (pid) => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
		updateCommentState({ parent_comment_id: pid });
	};
	const [commentSendLoader, setCommentSendLoader] = useState(false);
	async function commentHandler() {
		setCommentSendLoader(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		const body = {
			comment: commentState.comment,
			post_id: commentState.currentPostId,
			parent_comment_id:
				commentState.parent_comment_id == ""
					? null
					: commentState.parent_comment_id,
		};
		const response = await axios.post(
			backend_url + "v1/user/commentPost",
			body,
			{
				headers,
			}
		);
		if (commentState.parent_comment_id == "") {
			setCommentState({
				...commentState,
				comment: "",
				parent_comment_id: "",
				allcomments: [
					{
						_id: response.data._id,
						pic: response.data.pic,
						name: response.data.name,
						city: response.data.city,
						comment: response.data.comment,
						time: response.data.time,
						likes: response.data.likes,
						liked: response.data.liked,
					},
					...commentState.allcomments,
				],
			});
		} else {
			setCommentState({
				...commentState,
				comment: "",
			});
		}
		setCommentSendLoader(false);
	}
	async function fetchPageComments({ page }) {
		try {
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const response = await axios.get(
				`${backend_url}v1/user/getComments?page=${page}&post_id=${commentState.currentPostId}`,
				{ headers }
			);
			updateCommentState({
				allcomments: [...commentState.allcomments, ...response.data.comments],
				isLastPage: response.data.isLastPage,
			});
		} catch (err) {
			if (commentState.page === 0) {
				updateCommentState({ commentsLoading: false });
			}
		}
	}
	async function commentsEndHandler() {
		if (!commentState.isLastPage && !commentState.commentsLoading) {
			setCommentState({ ...commentState, page: commentState.page + 1 });
			fetchPageComments({ page: commentState.page + 1 });
		}
	}
	function handleUserSelection(userId) {
		setUserstate((prevState) => {
			let updatedSelectedIds = [...prevState.selected_ids];
			if (updatedSelectedIds.includes(userId)) {
				// Deselect the user
				updatedSelectedIds = updatedSelectedIds.filter((id) => id !== userId);
			} else {
				// Select the user
				updatedSelectedIds.push(userId);
			}
			return { ...prevState, selected_ids: updatedSelectedIds };
		});
	}
	async function fetchusersData(page, searchString, fromend = false) {
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					`v1/user/getUsers?page=${page}&search=${searchString}&available=${"NA"}`,
				{
					headers,
				}
			)
			.then((response) => {
				if (fromend) {
					updateuserstate({
						usersList: [...userstate.usersList, ...response.data.message.users],
						isLastPage: response.data.message.isLastPage,
					});
				} else {
					updateuserstate({
						usersList: response.data.message.users,
						isLastPage: response.data.message.isLastPage,
						Loading: false,
						page: 0,
					});
				}
			})
			.catch((err) => {
				if (page == 0) updateuserstate({ Loading: false });
			});
	}
	function shareEndHandler() {
		if (!userstate.isLastPage) {
			updateuserstate({ page: userstate.page + 1 });
			fetchusersData(userstate.page + 1, userstate.searchString, true);
		}
	}
	const [shareloading, setShareloading] = useState(false);
	async function sharePostHandler() {
		try {
			setShareloading(true);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const body = {
				type: "sharePost",
				message: commentState.currentPostId,
				toUserIds: userstate.selected_ids,
			};
			const response = await axios.post(
				backend_url + "v1/user/sharePostService",
				body,
				{
					headers,
				}
			);
			setShareloading(false);
			sharehandleSnapPress(-1);
			updateuserstate({
				selected_ids: [],
			});
		} catch (error) {
			console.error(error);
		}
	}
	function renderItem({ item }) {
		const isSelected = userstate.selected_ids.includes(item._id);
		return (
			<Pressable
				onPress={() => handleUserSelection(item._id)}
				className="p-5 flex-row justify-between"
			>
				<View className="flex-row items-center gap-5">
					<Image
						source={imagePlaceholder}
						style={{
							width: 50,
							height: 50,
							borderRadius: 50,
							borderColor: "black",
							borderWidth: 1.5,
						}}
					/>
					<View>
						<Text className="text-xl font-semibold">{item.username}</Text>
						<Text className="text-lg text-gray-500">{item.city}</Text>
					</View>
				</View>
				<Ionicons
					name={isSelected ? "checkbox" : "square-outline"} // Display check/uncheck icon based on selection state
					size={24}
					color={isSelected ? "green" : "gray"}
				/>
			</Pressable>
		);
	}
	async function removeconnectionHandler() {
		try {
			ehandleSnapPress(-1);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: commentState.currentUserId,
			};
			const response = await axios.post(
				backend_url + "v1/user/removeConnection",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
			}
		} catch (error) {}
	}
	async function reportUser() {
		try {
			ehandleSnapPress(-1);
			const token = await AsyncStorage.getItem("BearerToken");
			const headers = {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			};
			const data = {
				user_id: commentState.currentUserId,
			};
			const response = await axios.post(
				backend_url + "v1/user/reportUser",
				data,
				{
					headers,
				}
			);
			if (response.status == 200) {
				// setUser({ ...user, connectionStatus: "connect" });
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	return (
		<GestureHandlerRootView>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<View className={`${modalVisible ? "bg-gray-300" : "bg-white"} h-full`}>
					<SafeAreaView>
						<FlatList
							data={posts}
							keyExtractor={(item, index) => index.toString()}
							ListHeaderComponent={() => (
								<Pressable
									onPress={() => router.back()}
									className="flex-row p-5 items-center gap-3"
								>
									<Ionicons
										name={"arrow-back-outline"}
										size={28}
										color="gray"
									/>
									<Text className="text-2xl">Home</Text>
								</Pressable>
							)}
							ListFooterComponent={() =>
								isLastPage ? (
									<Text style={{ textAlign: "center", padding: 30 }}>
										No more posts to display
									</Text>
								) : (
									<ActivityIndicator size="large" color="gray" />
								)
							}
							onEndReached={endHandler}
							ListEmptyComponent={
								loading ? (
									<View className="h-screen flex items-center justify-center">
										<ActivityIndicator size="large" color="gray" />
									</View>
								) : (
									<View className="h-screen flex items-center justify-center">
										<Text>No Posts to display</Text>
									</View>
								)
							}
							renderItem={({ item }) => (
								<PostComponent
									post={item}
									modalVisible={modalVisible}
									setModalVisible={setModalVisible}
									handleSnapPress={handleSnapPress}
									updateCommentState={updateCommentState}
									inicomments={inicomments}
									ehandleSnapPress={ehandleSnapPress}
									eModalVisible={eModalVisible}
									seteModalVisible={seteModalVisible}
									setShareModalVisible={setShareModalVisible}
									shareModalVisible={shareModalVisible}
									sharehandleSnapPress={sharehandleSnapPress}
								/>
							)}
							refreshControl={
								<RefreshControl
									refreshing={refresh}
									onRefresh={refreshHandler}
								/>
							}
						/>
					</SafeAreaView>
					{modalVisible && (
						<BottomSheet
							ref={sheetRef}
							snapPoints={snapPoints}
							enablePanDownToClose
							className="bg-white h-full"
							onClose={() => {
								setModalVisible(false);
								setCommentState({
									...commentState,
									allcomments: [],
									currentPostId: "",
								});
							}}
						>
							<BottomSheetFlatList
								data={commentState.allcomments}
								keyExtractor={(i, index) => index}
								renderItem={({ item, index }) => (
									<CommentComponent
										item={item}
										index={index}
										openKeyboard={openKeyboard}
										commentState={commentState}
									/>
								)}
								onEndReached={commentsEndHandler}
								ListFooterComponent={() =>
									commentState.isLastPage ? (
										<Text style={{ textAlign: "center", padding: 30 }}>
											You have reached the end of Page
										</Text>
									) : commentState.allcomments ? (
										<View className="flex items-center justify-center">
											<ActivityIndicator size="large" color="gray" />
										</View>
									) : (
										<View></View>
									)
								}
								ListEmptyComponent={
									commentState.commentsLoading && !commentState.isLastPage ? (
										<View></View>
									) : (
										<Text style={{ textAlign: "center", padding: 30 }}>
											No Data To Display
										</Text>
									)
								}
								keyboardShouldPersistTaps="always"
								keyboardDismissMode="on-drag"
								contentContainerStyle={{ padding: 10 }}
							/>
							<View className=" m-3 flex-row justify-between items-center bg-[#FFFFFF] h-[50px] border rounded-2xl">
								<View className="flex-row items-center ml-2 w-[73%]">
									<Image
										source={
											loggedInUser.pic
												? { uri: loggedInUser.pic.url }
												: imagePlaceholder
										}
										style={{
											width: 30,
											height: 30,
											borderRadius: 50,
											borderColor: "black",
											borderWidth: 1.5,
										}}
									/>
									<TextInput
										className="h-[45px] pl-5 w-full"
										ref={inputRef}
										placeholder="Leave your comment here"
										value={commentState.comment}
										onChangeText={(data) =>
											updateCommentState({ comment: data })
										}
									/>
								</View>
								<Pressable
									className="pl-5 pr-5 pt-1 pb-1 mr-5 rounded-full bg-[#24A0ED]"
									disabled={commentSendLoader}
									onPress={commentHandler}
								>
									<Ionicons name="arrow-up-outline" size={24} color="white" />
								</Pressable>
							</View>
						</BottomSheet>
					)}
					{eModalVisible && (
						<BottomSheet
							ref={eSheetRef}
							snapPoints={eSnapPoints}
							enablePanDownToClose
							// onClose={handleShareClose}
							className="bg-white"
						>
							<View className="flex-1 items-center justify-between mt-5 mb-5">
								<TouchableOpacity onPress={removeconnectionHandler}>
									<Text className="text-3xl">Remove Connection</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										router.push({
											pathname: "/shareProfile",
											params: {
												profile_id: commentState.currentUserId,
											},
										});
									}}
								>
									<Text className="text-3xl">Share this Profile</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={reportUser}>
									<Text className="text-3xl text-red-500">Report</Text>
								</TouchableOpacity>
							</View>
						</BottomSheet>
					)}
					{shareModalVisible && (
						<BottomSheet
							ref={shareSheetRef}
							snapPoints={shareSnapPoints}
							enablePanDownToClose
							className="bg-white"
							onClose={() => {
								setShareModalVisible(false);
								sharehandleSnapPress(-1);
								updateuserstate({
									selected_ids: [],
									page: 0,
									searchString: "",
									usersList: userstate.usersList.slice(
										0,
										parseInt(userstate.page_limit)
									),
								});
							}}
						>
							<View className="p-3 flex-row flex-wrap"></View>
							<View className="flex-row items-center gap-5 pl-5">
								<Ionicons
									name={"close-outline"}
									size={26}
									color="gray"
									onPress={() => {
										setShareModalVisible(false);
										sharehandleSnapPress(-1);
									}}
								/>
								<View className="flex-row items-center justify-center bg-[#ECE6F0] rounded-lg w-[80%] p-3">
									<Ionicons
										name="search-outline"
										size={20}
										color="gray"
										style={{ position: "absolute", left: 15 }}
									/>
									<TextInput
										style={{
											flex: 1,
											height: "100%",
											paddingLeft: 40,
										}}
										onChangeText={(data) => {
											updateuserstate({ searchString: data, page: 0 });
											debounceCallSearch(data);
										}}
										placeholder="Search by ID or University or Location"
									/>
								</View>
							</View>
							<BottomSheetFlatList
								data={userstate.usersList}
								keyExtractor={(i, index) => index}
								renderItem={renderItem}
								onEndReached={shareEndHandler}
								ListFooterComponent={() =>
									userstate.isLastPage ? (
										<Text style={{ textAlign: "center", padding: 30 }}>
											You have reached the end of Page
										</Text>
									) : (
										<ActivityIndicator size="large" color="gray" />
									)
								}
								ListEmptyComponent={
									<Text style={{ textAlign: "center", padding: 30 }}>
										No Data: Please change filters
									</Text>
								}
								keyboardShouldPersistTaps="always"
								keyboardDismissMode="on-drag"
								contentContainerStyle={{ padding: 10 }}
							/>
							{userstate.selected_ids.length > 0 && (
								<Pressable
									className="border p-4 flex-row items-center justify-center bg-blue-500 rounded-full ml-5 mr-5"
									onPress={sharePostHandler}
								>
									{shareloading ? (
										<ActivityIndicator size="large" color="white" />
									) : (
										<Text className="text-4xl text-white">Send</Text>
									)}
								</Pressable>
							)}
						</BottomSheet>
					)}
				</View>
			</KeyboardAvoidingView>
		</GestureHandlerRootView>
	);
}
