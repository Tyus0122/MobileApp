import { Text, View, Pressable } from "react-native";
import { router, Link ,Redirect} from "expo-router";
export default function Index() {
    
    return (
        <View className="flex-1 justify-center items-center">
            <Link href={"/login"} className="border border-blue-500 p-5">
                <Text className="text-black font-semibold">loginsd</Text>
            </Link>
            <Pressable >
                <Text>store</Text>
            </Pressable>
            <Pressable>
                <Text>store</Text>
            </Pressable>
        </View>
    );
}
