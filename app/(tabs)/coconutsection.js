import { View, Text,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { router } from 'expo-router';

export const coconutsection = () => {
  return (
    <View className="bg-white flex-1 items-center">
       <View className="flex flex-row mt-36 ">
            <TouchableOpacity className="border border-gray-400 w-[150px] h-[150px] rounded-lg"  onPress={() => router.navigate("../(tabs)/sectionA")}>
            <Image source={require("../../assets/images/Coconut.png")} className="w-[40px] h-[40px] mt-5 ml-14"/>  
            <Text className="font-medium text-base mt-12 text-center">Section A</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-400 w-[150px] h-[150px] rounded-lg ml-5"  onPress={() => router.navigate("../(tabs)/sectionB")}>
            <Image source={require("../../assets/images/Coconut.png")} className="w-[40px] h-[40px] mt-5 ml-14"/>  
            <Text className="font-medium text-base mt-12 text-center">Section B</Text>
            </TouchableOpacity>
        </View>
         <View className="items-center justify-center mt-12">
            <TouchableOpacity className="border border-gray-400 w-[150px] h-[150px] rounded-lg"  onPress={() => router.navigate("../(tabs)/sectionC")} >
            <Image source={require("../../assets/images/Coconut.png")} className="w-[40px] h-[40px] mt-5 ml-14"/>  
            <Text className="font-medium text-base mt-12 text-center">Section C</Text>
            </TouchableOpacity>
        </View>
    </View>

  )
}

export default coconutsection