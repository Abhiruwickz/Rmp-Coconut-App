import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'

const home = () => {
  return (
    <View className="bg-white flex-1">
      <View className="flex flex-row">
        <Image source = {require("../../assets/images/Rmplogo.png")} className="rounded-lg w-[80px] h-[80px] mt-10 " />
        <Text className="font-medium text-base mt-16">Coconut Products</Text>
        <TouchableOpacity>
        <Image source = {require("../../assets/images/notification.png")} className="rounded-lg w-[24px] h-[24px] mt-16 ml-28" />
        </TouchableOpacity>
      </View>
      <Text className="text-lg font-semibold mb-5 text-gray-800 mt-5 ml-4 ">Summary</Text>
      <View className="flex flex-row">
        <View className="border border-gray-400 w-[150px] h-[150px] rounded-lg ml-4">
          <Image source={require("../../assets/images/totalcoco.png")} className="w-[24px] h-[24px] mt-2 ml-3"/>
           <Text className="text-center mt-10"> Total Coconuts</Text>
        </View>
        <View className="border border-gray-400 w-[150px] h-[150px] rounded-lg ml-6">
        <Image source={require("../../assets/images/rejection.png")} className="w-[24px] h-[24px] mt-2 ml-3"/>
        <Text className="text-center mt-10"> Total Rejections</Text>
        </View>
      </View>
      <Text className="text-lg font-semibold mb-5 text-gray-800 mt-5 ml-4 ">Analysis</Text>


    </View>
  )
}

export default home