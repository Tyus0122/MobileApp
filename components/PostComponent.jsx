import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export function PostComponent() {
    return (
        <View>
            <View className="p-5">
                <View className="flex-row items-center justify-between">
                    <View
                        className="flex-row items-center justify-between"
                        style={{ width: "57%", height: "100%" }}
                    >
                        <Image
                            source={require("@/assets/tyuss/shadow.png")}
                            class
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 50,
                                borderColor: "black",
                                borderWidth: 1.5,
                            }}
                        />
                        <View>
                            <Text className="text-xl font-medium">
                                Rushika_devarakonda
                            </Text>
                            <Text>vijayawada</Text>
                        </View>
                    </View>
                    <View className="w-1/2">
                        <Ionicons
                            name={"ellipsis-vertical-outline"}
                            size={24}
                        />
                    </View>
                </View>
                <View className="mt-3">
                    <Text style={{ textAlign: "center" }}>
                        We have twelve SUMMITS 🗻 packed with and hosted by the
                        leading experts of the industry 🤓 - the best way to
                        dive deep into today's hottest topics in tech and
                        marketing! total of around 600 top speakers and over 200
                        hours of content await you at DMEXCO. Discuss with the
                        most important industry leaders on the 12+ stages!
                        hashtag #New this year: The Cologne exhibition halls
                        will shine in different topic worlds. Whether
                        e-commerce, media or agencies: Here you will find what
                        you are looking for!
                    </Text>
                </View>
            </View>
            <View className="flex items-center justify-center">
                <Image
                    source={require("@/assets/tyuss/samplePost.png")}
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
                        name={"heart-outline"}
                        size={24}
                        color={"black"}
                    />
                    <Ionicons name={"chatbubble-outline"} size={24} />
                    <Ionicons name={"paper-plane-outline"} size={24} />
                </View>
                <View>
                    <Ionicons name={"bookmark-outline"} size={24} />
                </View>
            </View>
            <View className="pl-5">
                <Text className="text-lg font-semibold">11,300 likes</Text>
                <Text className="text-lg text-gray-500">view 100 comments</Text>
                <Text className="text-lg text-gray-500">12 may</Text>
            </View>
        </View>
    );
}
