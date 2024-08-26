import { Text, View, Pressable } from "react-native";
import { router, Link } from "expo-router";
export default function Index() {
    console.log('hello')
    function pressHandler() {
        console.log("hello");
        // router.push({
        //   pathname:'login',
        //   params:{
        //     username:"user@gmail.com",
        //     password:"***********"
        //   }
        // })
    }
    return (
        <View className="flex-1 justify-center items-center">
            <Link href={"/login"} className="border border-blue-500 p-5">
                {/* <Pressable className="border border-gray-900 p-3 rounded bg-blue-500" onPress={pressHandler}> */}
                <Text className="text-black font-semibold">loginsd</Text>
                {/* </Pressable> */}
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
