import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	Modal,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { React, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhoneInput from "react-native-phone-input";
import ToastManager, { Toast } from "expo-react-native-toastify";
import { backend_url, validatePassword } from "@/constants/constants";
import axios from "axios";
import { router, Link } from "expo-router";
export default function Index() {
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		email: "",
		dob: "",
		phno: "",
		phnocode: "+1",
		phnocode: "",
		password: "",
		confirmPassword: "",
	});
	const [submit, setSubmit] = useState(false);
	const [modalopen, setmodalopen] = useState(false);
	const [error, setError] = useState(false);
	const [showPassword, setShowPassword] = useState(true);
	const [errorValue, setErrorVlaue] = useState("");
	const PhoneInputRef = useRef(null);
	function formatDate(date) {
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	function validateDate(dateString) {
		const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
		const match = dateString.match(regex);
	
		if (!match) {
			return { isValid: false, error: "Invalid format. Use DD-MM-YYYY." };
		}
	
		let [_, day, month, year] = match;
		day = parseInt(day, 10);
		month = parseInt(month, 10);
		year = parseInt(year, 10);
	
		if (month < 1 || month > 12) {
			return { isValid: false, error: "Invalid month. Use values between 01-12." };
		}
	
		if (day < 1 || day > 31) {
			return { isValid: false, error: "Invalid day. Use values between 01-31." };
		}
	
		// Check days in each month
		const daysInMonth = {
			1: 31, 2: (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 
			3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
		};
	
		if (day > daysInMonth[month]) {
			return { isValid: false, error: `Invalid day for the month. ${month} has only ${daysInMonth[month]} days.` };
		}
	
		return { isValid: true, error: null };
	}
	function validation() {
		if (formData.fullname.length == 0) {
			setError(true);
			setErrorVlaue("Full name is required");
			return;
		}
		if (formData.username.length == 0) {
			setError(true);
			setErrorVlaue("Username is required");
			return;
		}
		if (formData.phno.length == 0) {
			setError(true);
			setErrorVlaue("Phone number is required");
			return;
		}
		if (formData.email.length == 0) {
			setError(true);
			setErrorVlaue("Email is required");
			return;
		}
		if (formData.dob.length == 0) {
			setError(true);
			setErrorVlaue("Date of birth is required");
			return;
		}
		// if (formData.phno.length != 10) {
		// 	setError(true);
		// 	setErrorVlaue("Invalid phone number");
		// 	return;
		// }
		if (!isValidEmail(formData.email)) {
			setError(true);
			setErrorVlaue("Invalid email address");
			return;
		}
		if (formData.password != formData.confirmPassword) {
			setError(true);
			setErrorVlaue("Passwords do not match");
			return;
		}
		let dob_validation = validateDate(formData.dob)
		console.log(dob_validation)
		if (!dob_validation.isValid) {
			setError(true);
			setErrorVlaue(dob_validation.error);
			return 
		}
		let { valid, message } = validatePassword(formData.password);
		if (!valid) {
			setError(true);
			setErrorVlaue(message);
			return;
		}
		// submitHandler();
	}
	function submitHandler() {
		setSubmit(true);
		axios
			.post(backend_url + "v1/user/signup", formData)
			.then((response) => {
				setSubmit(false);
				if (response.data.status && response.data.status != "ok") {
					setError(true);
					setErrorVlaue(response.data.errorMessage);
				} else {
					router.push({
						pathname: "loginOtp",
						params: {
							phno: formData.phno,
						},
					});
				}
			})
			.catch((err) => {
				console.log(err);
				setSubmit(false);
				setError(true);
				setErrorVlaue("internal error occured please try again");
				// router.push("/login");
			});
	}
	return (
		<ScrollView
			keyboardShouldPersistTaps={"always"}
			keyboardDismissMode="on-drag"
		>
			<SafeAreaView>
				<View className="h-full bg-blue-50">
					<Pressable
						className="mt-[30px] ml-[20px]"
						onPress={() => router.back()}
					>
						<Ionicons name={"arrow-back-outline"} size={24} color="gray" />
					</Pressable>
					<View className=" pl-[15%] pr-[15%]">
						<View className="items-center mt-[40px] mb-5">
							<Text className="text-5xl font-extrabold mb-3">Sign Up</Text>
							<Text className="text-base text-gray-500">
								Alread have an account?{" "}
								<Link href={"/login"}>
									<Text className="text-blue-500">Login</Text>
								</Link>
							</Text>
							{error && (
								<View className="mt-4">
									<Text className="text-red-500 text-base font-normal">
										{errorValue}
									</Text>
								</View>
							)}
						</View>

						<View className="mt-5">
							<Text className="text-base text-gray-500">Fullname</Text>
							<TextInput
								className="bg-white mt-2 h-[40px] rounded-lg p-2 text-base"
								onChangeText={(data) => {
									setFormData({
										...formData,
										fullname: data,
									});
									setError(false);
								}}
							/>
						</View>
						<View className="mt-5">
							<Text className="text-base text-gray-500">Username</Text>
							<TextInput
								className="bg-white mt-2 h-[40px] rounded-lg p-2 text-base"
								onChangeText={(data) => {
									setFormData({
										...formData,
										username: data,
									});
									setError(false);
								}}
							/>
						</View>

						<View className="mt-5">
							<Text className="text-base text-gray-500">Phone</Text>
							<View className="flex-row items-center gap-2">
								<View className="p-2 bg-white h-[40px] rounded-lg flex-row items-center mr-2">
									<Ionicons
										name={"chevron-down-outline"}
										size={8}
										color="gray"
									/>
									<PhoneInput
										ref={PhoneInputRef}
										onSelectCountry={(data) => {
											setFormData({
												...formData,
												phnocode: "+" + PhoneInputRef.current.getCountryCode(),
											});
										}}
										onChangePhoneNumber={(data) => {
											setFormData({
												...formData,
												phno: data,
											});
											setError(false);
										}}
										initialCountry={"us"}
									/>
								</View>
							</View>
						</View>
						<View className="mt-5">
							<Text className="text-base text-gray-500">Email</Text>
							<TextInput
								className="bg-white mt-2 h-[40px] rounded-lg p-2 text-base"
								onChangeText={(data) => {
									setFormData({ ...formData, email: data });
									setError(false);
								}}
							/>
						</View>

						<View className="mt-5 mb-5">
							<Text className="text-base text-gray-500">Password</Text>
							<View className="relative">
								<TextInput
									className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
									secureTextEntry={showPassword}
									onChangeText={(data) => {
										setFormData({
											...formData,
											confirmPassword: data,
											password: data,
										});
										setError(false);
									}}
								/>
								<Pressable
									onPress={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-2 mt-3"
								>
									<Ionicons
										name={showPassword ? "eye-off" : "eye"}
										size={24}
										color="gray"
									/>
								</Pressable>
							</View>
						</View>
						<View className="mt-5">
							<Text className="text-base text-gray-500">Birth of date </Text>
							<View className="relative">
								<Pressable onPress={() => setmodalopen(!modalopen)}>
									<TextInput
										placeholder={formData.dob || "DD-MM-YYYY"}
										placeholderTextColor="gray"
                                        value={formData.dob}
										className="bg-white mt-2 h-[40px]  rounded-lg p-2 text-base"
										onChangeText={(data) => {
											setFormData({
												...formData,
												dob: data,
											});
											setError(false);
										}}
									/>
								</Pressable>
							</View>
						</View>
						{/* {modalopen && (
							<DateTimePicker
								value={new Date()}
								mode={"date"}
								is24Hour={true}
								onChange={(e, dates) => {
									console.log(e.type);
									setmodalopen(!modalopen);
									setError(false);
									if (e.type === "set") {
										setFormData({
											...formData,
											dob: formatDate(dates),
										});
									}
								}}
							/>
						)} */}
						<View className="mt-[50px] mb-[50px]">
							<Pressable
								className="bg-blue-500 h-[40px] rounded-lg flex items-center justify-center"
								onPress={validation}
							>
								{submit ? (
									<ActivityIndicator size={"large"} color={"white"} />
								) : (
									<Text className="text-white text-base font-semibold">
										Sign up
									</Text>
								)}
							</Pressable>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
}
