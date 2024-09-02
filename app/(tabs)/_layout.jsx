import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({ icon, color, size, focused, text }) => {
    return (
        <View className="flex justify-center items-center">
            <Ionicons name={icon} size={size} color={color} />
            {
                focused && (
                    <Text className="text-black-500">
                        {text}
                    </Text>
                )
            }
        </View>
    );
};

export default function tabs() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                    // display:'none'
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={focused ? "home-sharp" : "home-outline"}
                            color={color}
                            size={24}
                            text="Home"
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="accomodation"
                options={{
                    title: "accomodation",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={
                                focused ? "calendar-sharp" : "calendar-outline"
                            }
                            color={color}
                            size={24}
                            focused={focused}
                            text="Accommodation"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="post"
                options={{
                    title: "post",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={
                                focused ? "add-circle-sharp" : "add-circle-outline"
                            }
                            color={color}
                            size={28}
                            focused={focused}
                            text="Post"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "profile",
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={
                                focused
                                    ? "person-circle-sharp"
                                    : "person-circle-outline"
                            }
                            color={color}
                            size={28}
                            focused={focused}
                            text="Profile"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
