import React from "react";
import { View, Text } from "react-native";

export const OptionsIconComponent = () => {
	return (
		<View className="flex-row gap-1">
			<View className="gap-1">
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 3, height: 3 }}
				></View>
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 3, height: 3 }}
				></View>
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 3, height: 3 }}
				></View>
			</View>
			<View className="gap-1">
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 15, height: 3 }}
				></View>
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 15, height: 3 }}
				></View>
				<View
					className="bg-gray-500 rounded-full h-[5px] w-[5px]"
					style={{ width: 15, height: 3 }}
				></View>
			</View>
		</View>
	);
};
