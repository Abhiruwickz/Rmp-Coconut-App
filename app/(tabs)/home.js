import { View, Text,Image } from 'react-native'
import React from 'react'

const home = () => {
  return (
    <View className="bg-white flex-1">
      <View className="flex flex-row">
      <Image source = {require("../../assets/images/Rmplogo.png")} className="rounded-lg w-[80px] h-[80px] mt-10 " />
      <Text className="font-medium text-base mt-16">Coconut Products</Text>
      </View>
    </View>
  )
}

export default home