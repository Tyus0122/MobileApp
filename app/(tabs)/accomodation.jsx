import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	ActivityIndicator,
	FlatList,
	Platform,
	KeyboardAvoidingView,
	Keyboard,
	TouchableOpacity,
} from "react-native";
import { PostComponent } from "@/components/PostComponent";
import { UserComponent } from "@/components/UserComponent";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { backend_url, debounce_time } from "@/constants/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { debounce } from "lodash";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { CommentComponent } from "@/components/CommentComponent";
import DateTimePicker from "@react-native-community/datetimepicker";
const imagePlaceholder = require("@/assets/tyuss/shadow1.png");
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function Accomodation() {
	const [AccomodationLoading, setAccomodationLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [connects, setConnects] = useState(true);
	const [
		AccomodationsIsLastAccomodationsPage,
		setAccomodationsIsLastAccomodationsPage,
	] = useState(false);
	const [AccomodationsPage, setAccomodationsPage] = useState(0);
	const [AccomodationSearch, setAccomodationSearch] = useState("");
	const [isChecked, setIsChecked] = useState(true);

	//
	const sheetRef = useRef(null);
	const shareSheetRef = useRef(null);
	const [shareModalVisible, setShareModalVisible] = useState(false);
	const shareSnapPoints = ["80%"];
	const eSheetRef = useRef(null);
	const [eModalVisible, seteModalVisible] = useState(false);
	const eSnapPoints = ["50%"];
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
	//
	async function accomodationsEndHandler() {
		if (!AccomodationsIsLastAccomodationsPage) {
			setAccomodationsPage(AccomodationsPage + 1);
			fetchAccomodationsData(
				AccomodationsPage + 1,
				AccomodationSearch,
				true,
				isChecked
			);
		}
	}
	const debounceCallAccomodationSearch = useCallback(
		debounce((data, iscchecked) => {
			fetchAccomodationsData(0, data, false, iscchecked);
		}, debounce_time),
		[]
	);
	const [eventSearch, setEventSearch] = useState("");
	const [viewCalendar, setViewCalendar] = useState(false);
	const [datesearchevent, setDateSearchEvent] = useState("");
	const debounceCalleventsSearch = useCallback(
		debounce((data, date) => {
			fetchData({ page: 0, search: data, date: date });
		}, debounce_time),
		[]
	);
	const debounceCallDateeventsSearch = useCallback(
		debounce((data, search) => {
			fetchData({ page: 0, search: search, date: data });
		}, debounce_time),
		[]
	);
	async function fetchAccomodationsData(
		AccomodationsPage = 0,
		AccomodationSearch = "",
		fromend = false,
		available = isChecked
	) {
		if (AccomodationsPage == 0) setAccomodationLoading(true);
		const token = await AsyncStorage.getItem("BearerToken");
		const headers = {
			authorization: "Bearer " + token,
			"content-type": "application/json",
		};
		axios
			.get(
				backend_url +
					`v1/user/getUsers?page=${AccomodationsPage}&search=${AccomodationSearch}&available=${available}`,
				{
					headers,
				}
			)
			.then((response) => {
				if (fromend) {
					setUsers([...users, ...response.data.message.users]);
				} else {
					setUsers(response.data.message.users);
				}
				setAccomodationsIsLastAccomodationsPage(
					response.data.message.isLastPage
				);
				if (AccomodationsPage == 0) setAccomodationLoading(false);
			})
			.catch((err) => {
				if (AccomodationsPage == 0) setAccomodationLoading(false);
			});
	}
	async function fetchData({
		page = 0,
		mode = "normal",
		search = "",
		date = "",
	}) {
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
			.get(
				backend_url +
					"v1/user/getposts?page=" +
					page +
					"&search=" +
					search +
					"&date=" +
					date,
				{
					headers,
				}
			)
			.then((response) => {
				if (mode == "refresh" || page == 0) {
					setPosts(response.data.message.posts);
					setInicomments(response.data.message.comments);
				} else {
					setPosts([...posts, ...response.data.message.posts]);
					setInicomments({ ...inicomments, ...response.data.message.comments });
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
			})
			.catch((err) => {
				if (page == 0) setLoading(false);
			});
	}
	useEffect(() => {
		fetchAccomodationsData();
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
			fetchData({ page: page + 1, search: eventSearch, date: datesearchevent });
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
		console.log(body)
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
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView>
				<View className="bg-white items-center">
					<View className="flex-row p-5 items-center gap-3">
						<Pressable onPress={() => router.back()}>
							<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
						</Pressable>
						{connects ? (
							<View className="flex-row items-center bg-[#ECE6F0] rounded-full w-[90%] h-[50px] p-3">
								<Ionicons
									name="search-outline"
									size={20}
									color="gray"
									style={{ position: "absolute", left: 15 }}
								/>
								<TextInput
									style={{
										// flex: 1,
										height: "100%",
										paddingLeft: 40,
									}}
									className="w-full"
									onChangeText={(data) => {
										setAccomodationSearch(data);
										setAccomodationsPage(0);
										debounceCallAccomodationSearch(data, isChecked);
									}}
									placeholder="Search by ID or University or Location"
								/>
							</View>
						) : (
							<View className="flex-row items-center bg-[#ECE6F0] rounded-full w-[90%] h-[50px] p-3">
								<Ionicons
									name="search-outline"
									size={20}
									color="gray"
									style={{ position: "absolute", left: 15 }}
								/>
								<TextInput
									style={{
										// flex: 1,
										height: "100%",
										paddingLeft: 40,
									}}
									className="w-full"
									onChangeText={(data) => {
										setEventSearch(data);
										setPage(0);
										debounceCalleventsSearch(data, datesearchevent);
									}}
									placeholder="Search by Location"
								/>
							</View>
						)}
					</View>
					<View className="flex-row justify-between w-[80%]">
						{["Accomodation", "Events"].map((item, index) => {
							const isActive =
								(index === 0 && connects) || (index === 1 && !connects);
							return (
								<View className="p-3" key={item}>
									<TouchableOpacity onPress={() => setConnects(index === 0)}>
										<Text
											className={`text-xl ${isActive ? "font-semibold" : ""}`}
										>
											{item}
										</Text>
										{isActive && <View className="bg-gray-500 h-[2px]" />}
									</TouchableOpacity>
								</View>
							);
						})}
					</View>
				</View>
				{/* <View className="bg-gray-500 h-[2px]" /> */}
			</SafeAreaView>
			{AccomodationLoading ? (
				<View className="h-screen bg-white flex-1 items-center justify-center ">
					<ActivityIndicator size="large" color="blue" />
				</View>
			) : !AccomodationLoading && connects ? (
				<FlatList
					className="bg-white"
					data={users}
					renderItem={({ item, index }) => (
						<Pressable
							key={index}
							onPress={() => {
								router.push({
									pathname: "/userProfile",
									params: {
										_id: item._id,
									},
								});
							}}
						>
							<UserComponent user={item} />
						</Pressable>
					)}
					ListEmptyComponent={
						<Text style={{ textAlign: "center", padding: 30 }}>
							No Data: Please change filters
						</Text>
					}
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
					contentContainerStyle={{ padding: 10 }}
					onEndReached={accomodationsEndHandler}
					ListHeaderComponent={() => (
						<View className="bg-white p-5">
							<View
								className="pr-5"
								style={{
									alignItems: "flex-end",
								}}
							>
								<Pressable
									className="flex-row items-center justify-center gap-2"
									onPress={() => {
										setAccomodationsPage(0);
										if (isChecked) {
											setIsChecked(false);
											debounceCallAccomodationSearch(AccomodationSearch, false);
										} else {
											setIsChecked(true);
											debounceCallAccomodationSearch(AccomodationSearch, true);
										}
									}}
								>
									<View className="flex-row items-center justify-center gap-2">
										<Ionicons
											name={isChecked ? "checkbox-outline" : "square-outline"}
											size={24}
											color="gray"
										/>
										<Text className="text-xl text-gray-500">Available</Text>
									</View>
								</Pressable>
							</View>
						</View>
					)}
					ListFooterComponent={() =>
						AccomodationsIsLastAccomodationsPage ? (
							<Text style={{ textAlign: "center", padding: 30 }}>
								You have reached the end of AccomodationsPage
							</Text>
						) : (
							<ActivityIndicator size="large" color="gray" />
						)
					}
				/>
			) : (
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
					style={{ flex: 1 }}
				>
					<View
						className={`${modalVisible ? "bg-gray-300" : "bg-white"} h-full`}
					>
						<View>
							<View className="flex-row items-center justify-between pl-5 pr-5">
								<TouchableOpacity
									className="flex-row items-center gap-3 pl-3 pr-3 pt-1 pb-1 border rounded-xl"
									onPress={() => setViewCalendar(!viewCalendar)}
								>
									<Ionicons name={"calendar-outline"} size={28} color="gray" />
									<Text className="text-xl font-semi-bold">
										{datesearchevent ? `${datesearchevent}` : "Pick A Date"}
									</Text>
								</TouchableOpacity>

								{/* Clear Button */}
								<TouchableOpacity
									className="pl-3 pr-3 pt-1 pb-1 border border-red-500 rounded-xl"
									onPress={() => {
										setDateSearchEvent(""); // Clear the selected date
										setViewCalendar(false); // Close the calendar if it's open
										debounceCallDateeventsSearch("", eventSearch);
									}}
								>
									<Text className="text-black text-xl font-semibold">
										Clear
									</Text>
								</TouchableOpacity>
							</View>
							{viewCalendar && (
								<DateTimePicker
									value={new Date()}
									mode={"date"}
									onChange={(e, dates) => {
										if (e?.type === "dismissed") {
											// User canceled the picker
											setViewCalendar(false);
											return;
										}
										const date = new Date(dates); // Convert the ISO string to a Date object
										const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
										const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so +1) and pad with leading zero
										const year = date.getFullYear(); // Get the full year
										setDateSearchEvent(`${day}-${month}-${year}`);
										debounceCallDateeventsSearch(
											`${day}-${month}-${year}`,
											eventSearch
										);
										setViewCalendar(false);
									}}
								/>
							)}
							<FlatList
								data={posts}
								keyExtractor={(item, index) => index.toString()}
								ListFooterComponent={() =>
									isLastPage ? (
										<Text style={{ textAlign: "center", padding: 30 }}>
											No more posts to display
										</Text>
									) : (
										<ActivityIndicator size="large" color="gray" />
									)
								}
								contentContainerStyle={{ paddingBottom: 50 }}
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
							/>
						</View>
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
									keyExtractor={(i) => i._id}
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
												onPress={commentHandler}
												disabled={commentSendLoader}
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
									<Text className="text-3xl">Remove Connection</Text>
									<Text className="text-3xl">Share this Profile</Text>
									<Text className="text-3xl">Hide</Text>
									<Text className="text-3xl text-red-500">Report</Text>
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
									<Pressable className="border p-4 flex-row items-center justify-center bg-blue-500 rounded-full ml-5 mr-5">
										<Text className="text-4xl text-white">Send</Text>
									</Pressable>
								)}
							</BottomSheet>
						)}
					</View>
				</KeyboardAvoidingView>
			)}
		</GestureHandlerRootView>
	);
}
