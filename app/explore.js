import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';


const explore = () => {
  return (
    <View className="justify-center items-center bg-white flex-1">
      <View className="-mt-16">
      <Image
      source={require("../assets/images/Rmplogo.png")}
      className="rounded-lg w-[170px] h-[170px] justify-center"
      >
      </Image>
      <Text className="font-bold text-center text-slate-900 items-center mt-6">Welcome to the Rmp Coconuts!</Text>
    </View>
    <View className="mt-10">
      <TouchableOpacity className="bg-orange-600 rounded-lg w-[200px] h-[40px] mb-8 "   onPress={() => router.navigate("../(tabs)/signIn")}>
        <Text className="text-center text-white font-semibold text-lg mt-1">Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-orange-600 rounded-lg w-[200px] h-[40px] "  onPress={() => router.navigate("../(tabs)/signUp")}>
        <Text className="text-center text-white font-semibold text-lg mt-1">Sign Up</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default explore