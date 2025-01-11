import {
	View,
	Text,
	Image,
	Pressable,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const pp1 = require("@/assets/tyuss/PP1.png");
const pp2 = require("@/assets/tyuss/pp2.png");
const pp3 = require("@/assets/tyuss/pp3.png");
const pp4 = require("@/assets/tyuss/pp4.png");
export default function Profile() {
	return (
		<SafeAreaView>
			<ScrollView
				keyboardShouldPersistTaps={"always"}
				keyboardDismissMode="on-drag"
			>
				<View className="m-5">
					<Pressable
						onPress={() => router.back()}
						className="flex-row items-center gap-3"
					>
						<Ionicons name={"arrow-back-outline"} size={28} color="gray" />
						<Text className="text-3xl font-semibold">Profile</Text>
					</Pressable>
				</View>
				<View className="m-5">
					<View>
						<Text className="text-3xl font-bold">Privacy Policy</Text>
						<Text className="text-xl text-gray-700 mt-3">
							Friendzy ("we," "our," or "us") is committed to protecting your
							privacy. This Privacy Policy explains how we collect, use,
							disclose, and safeguard your information when you use our app. By
							using the app, you agree to the terms of this Privacy Policy
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">
							1. Information We Collect
						</Text>
						<Image
							source={pp1}
							style={{
								width: "50%",
								height: 200,
								resizeMode: "cover",
							}}
						/>
						<Text className="text-2xl mt-5 mb-3">a. Personal Information</Text>
						<Text className="text-xl text-gray-700 mt-3">
							We may collect personal information that you voluntarily provide,
							such as:
						</Text>
						<Text className="ml-5 text-xl mt-2">
							● Name{"\n"}● Email address{"\n"}● Phone number {"\n"}● Profile
							information
						</Text>
						<Text className="text-2xl mt-5 mb-3">b. Usage Data</Text>
						<Text className="text-xl text-gray-700 mt-3">
							We collect information about your interactions with the app, such
							as
						</Text>
						<Text className="ml-5 text-xl mt-2">
							● Device information (e.g., device type, operating system){"\n"}●
							Log data (e.g., IP address, access times, pages viewed)
						</Text>
						<Text className="text-2xl mt-5 mb-3">c. Location Data</Text>
						<Text className="text-xl text-gray-700 mt-3">
							With your permission, we may collect location data to provide
							location-based services, such as nearby accommodations.
						</Text>
						<Text className="text-2xl mt-5 mb-3">d. Third-Party Services</Text>
						<Text className="text-xl text-gray-700 mt-3">
							If you use the feature that connects you with a third-party app
							for assignment assistance, we may share certain necessary
							information (e.g., assignment details, relevant preferences) with
							that third-party app. This sharing is only done with your explicit
							consent.
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">
							2. How We Use Your Information
						</Text>
						<Image
							source={pp2}
							style={{
								width: "60%",
								height: 200,
								resizeMode: "cover",
							}}
						/>
						<Text className="text-xl text-gray-700 mt-3">
							We use the information we collect to:
						</Text>
						<Text className="ml-5 text-xl mt-2">
							● Provide and improve our services {"\n"}● Facilitate
							communication through the chat feature {"\n"}● Customize user
							experience {"\n"}● Address user inquiries and provide support{" "}
							{"\n"}● Ensure the security of the app {"\n"}● Connect you with
							third-party services, such as assignment assistance
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">
							3. Sharing Your Information
						</Text>
						<Image
							source={pp3}
							style={{
								width: "60%",
								height: 200,
								resizeMode: "cover",
							}}
						/>
						<Text className="text-xl text-gray-700 mt-3">
							We do not sell or rent your personal information. We may share
							your information with:
						</Text>
						<Text className="ml-5 text-xl mt-2">
							● Service providers who assist us in delivering our services{" "}
							{"\n"}● Authorities if required by law {"\n"}● Third-party apps
							for assignment assistance, but only with your explicit consent{" "}
							{"\n"}● Other users, but only when necessary for app
							functionalities (e.g., events or housing listings)
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">4. Data Security</Text>
						<Image
							source={pp4}
							style={{
								width: "50%",
								height: 250,
								resizeMode: "cover",
							}}
						/>
						<Text className="text-xl text-gray-700 mt-3">
							We use administrative, technical, and physical measures to
							safeguard your information. However, no method of transmission
							over the Internet is 100% secure.
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">
							5. Your Rights (U.S. Compliance)
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							If you are located in the United States, you have the following
							rights under applicable privacy laws, including the California
							Consumer Privacy Act (CCPA):
						</Text>
						<Text className="ml-5 text-xl mt-2">
							● The right to know what personal data we collect and how we use
							it
							{"\n"}● The right to request deletion of your data
							{"\n"}● The right to opt-out of the sale of your data (we do not
							sell personal data)
							{"\n"}● The right to non-discrimination for exercising your rights
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">
							6. Updates to This Policy
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							We may update this Privacy Policy from time to time. Changes will
							be effective upon posting.
						</Text>
					</View>
					<View>
						<Text className="text-3xl mt-5 mb-3">7. Contact Us</Text>
						<Text className="text-xl text-gray-700 mt-3">
							If you have any questions or concerns about this Privacy Policy,
							please contact us at [Insert Contact Email].
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
