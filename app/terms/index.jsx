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
						<Text className="text-3xl font-bold">Terms and Conditions</Text>
						<Text className="text-xl text-gray-700 mt-3">
							These Terms and Conditions ("Terms") govern your use of Friendzy
							("the app"). By downloading or using the app, you agree to comply
							with these Terms. If you do not agree, do not download or use the
							app.
						</Text>
					</View>
					<View>
						<Text className="text-xl text-gray-700 mt-3">
							● To use the app, you must be at least 18 years old or have
							parental consent. By using the app, you represent that you meet
							these requirements.
						</Text>
						<Text className="text-xl text-gray-700 mt-3">● You agree to:</Text>
						<Text className="text-xl text-gray-700 mt-3 ml-5">
							● Provide accurate and current information
							{"\n"}● Use the app in compliance with applicable laws
							{"\n"}● Not misuse the app (e.g., post harmful content, attempt
							unauthorized access)
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							● The app includes a feature that connects users with a
							third-party app for assignment assistance. By using this feature,
							you:
						</Text>
						<Text className="text-xl text-gray-700 mt-3 ml-5">
							● Acknowledge that we are not responsible for the quality,
							accuracy, or outcomes of the third-party service
							{"\n"}● Agree to the sharing of relevant information necessary for
							the third-party app to assist you
							{"\n"}● Release us from liability for any issues arising from your
							use of the third-party service
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							● All content, trademarks, and materials within the app are the
							property of Friendzy. You may not use, copy, or distribute them
							without permission.
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							● Friendzy is not liable for:
						</Text>
						<Text className="text-xl text-gray-700 mt-3 ml-5">
							● Any inaccuracies in accommodation, events, or bus information
							{"\n"}● User interactions within the chat feature
							{"\n"}● Third-party services linked within the app, including
							assignment assistance
						</Text>
						<Text className="text-xl text-gray-700 mt-3">
							● This app is designed to comply with applicable laws in the
							United States. By using the app, you agree to adhere to all
							relevant U.S. regulations.
							{"\n"}● We reserve the right to terminate or suspend your access
							to the app at our discretion, with or without notice, if you
							violate these Terms.
							{"\n"}● We may update these Terms periodically. Continued use of
							the app after changes indicates your acceptance of the updated
							Terms.
							{"\n"}● These Terms are governed by the laws of the United States
							and the state in which Missouri.
							{"\n"}● For questions about these Terms, contact us at [Insert
							Contact Email].
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
