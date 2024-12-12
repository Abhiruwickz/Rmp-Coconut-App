import { View, Text,Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import React, { useState,useEffect } from 'react'
import { Real_time_database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';


const screenWidth = Dimensions.get('window').width;

const home = () => {
  const [loading, setLoading] = useState(true);
  const [totalCoconuts, setTotalCoconuts] = useState('0');
  const [totalRejections, setTotalRejections] = useState('0');
  const [sectionData, setSectionData] = useState({
    sectionA: { coconuts: [], rejections: [] },
    sectionB: { coconuts: [], rejections: [] },
    sectionC: { coconuts: [], rejections: [] },
  });
  const [selectedFilter, setSelectedFilter] = useState('Month');

  useEffect(() => {
    const coconutsRef = ref(Real_time_database, 'Coconuts');

    onValue(coconutsRef, (snapshot) => {
      const data = snapshot.val();
      let coconutsSum = 0;
      let rejectionsSum = 0;

      const filteredData = {
        sectionA: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
        sectionB: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
        sectionC: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
      };

      if (data) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const threeMonthsAgo = new Date(currentDate);
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

        Object.values(data).forEach((coconut) => {
          const date = new Date(coconut.date);
          const month = date.getMonth();
          const isWithinWeek = date >= oneWeekAgo && date <= currentDate;
          const isToday = date.toDateString() === currentDate.toDateString();
          const isWithinThreeMonths = date >= threeMonthsAgo && date <= currentDate;

          const nuts = parseInt(coconut.noOfNuts, 10) || 0;
          const rejections = parseInt(coconut.rejected, 10) || 0;

          if (
            (selectedFilter === 'Week' && isWithinWeek) ||
            (selectedFilter === 'Today' && isToday) ||
            (selectedFilter === '3 Months' && isWithinThreeMonths) ||
            selectedFilter === 'Month' 
          ) {
            coconutsSum += nuts;
            rejectionsSum += rejections;

            if (coconut.section === 'Section A') {
              filteredData.sectionA.coconuts[month] += nuts;
              filteredData.sectionA.rejections[month] += rejections;
            } else if (coconut.section === 'Section B') {
              filteredData.sectionB.coconuts[month] += nuts;
              filteredData.sectionB.rejections[month] += rejections;
            } else if (coconut.section === 'Section C') {
              filteredData.sectionC.coconuts[month] += nuts;
              filteredData.sectionC.rejections[month] += rejections;
            }
          }
        });
      }

      setTotalCoconuts(coconutsSum);
      setTotalRejections(rejectionsSum);
      setSectionData(filteredData);
      setLoading(false);
    });
  }, [selectedFilter]);
  

  const combinedGraphData = {
    labels: [ 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: sectionData.sectionA.coconuts,
        color: () => '#FF0000',
        strokeWidth: 2,
        label: 'Section A Coconuts',
      },
      {
        data: sectionData.sectionB.coconuts,
        color: () => '#00FF00',
        strokeWidth: 2,
        label: 'Section B Coconuts',
      },
      {
        data: sectionData.sectionC.coconuts,
        color: () => '#0000FF',
        strokeWidth: 2,
        label: 'Section C Coconuts',
      },
    ],
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (

    <View className="bg-white flex-1">
      <View className="flex flex-row">
        <Image source = {require("../../assets/images/Rmplogo.png")} className="rounded-lg w-[80px] h-[80px] mt-10 " />
        <Text className="font-medium text-base mt-16">Coconut Products</Text> 
        <Image source = {require("../../assets/images/notification.png")} className="rounded-lg w-[24px] h-[24px] mt-16 ml-28" />
      </View>
      <View className = "flex flex-row ">
      <Text className="text-lg font-semibold mb-5 text-gray-800 mt-5 ml-4 ">Summary</Text>
      <View className=" ml-24 font-semibold">
      <Picker
        selectedValue={selectedFilter}
        onValueChange={(itemValue) => setSelectedFilter(itemValue)}
        style={{ margin: 8, height: 20, width: 150 }}
      
      >
        {/* <Picker.Item label="3 Months" value="3 Months" /> */}
        <Picker.Item label="Month" value="Month" />
        <Picker.Item label="Week" value="Week" />
        <Picker.Item label="Today" value="Today" />
      </Picker>
      </View>
      </View>

      <View className="flex flex-row">
        <View className="border border-gray-400 w-[150px] h-[150px] rounded-lg ml-4">
          <Image source={require("../../assets/images/totalcoco.png")} className="w-[36px] h-[36px] mt-2 ml-3"/>
           <Text className="ml-6 text-xl font-bold mt-6">{totalCoconuts}</Text>
           <Text className="ml-5 mt-2"> Total Coconuts</Text>
        </View>
        <View className="border border-gray-400 w-[150px] h-[150px] rounded-lg ml-6">
        <Image source={require("../../assets/images/rejection.png")} className="w-[36px] h-[36px] mt-2 ml-3"/>
        <Text className="ml-6 text-xl font-bold mt-6">{totalRejections}</Text>
        <Text className="ml-5 mt-2"> Total Rejections</Text>
        </View>
      </View>
      <Text className="text-lg font-semibold mb-5 text-gray-800 mt-5 ml-4 ">Analysis</Text>
  
      <LineChart
        data={combinedGraphData}
        width={screenWidth - 30} // from react-native
        height={320}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0, // No decimal places
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black for lines and text
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '1',
            stroke: '#ffa726',
          },
        }}
        withVerticalLines={true}
        withHorizontalLines={true}
        withDots={true}
        withInnerLines={false} // To match the cleaner look
      />

    </View>

  )
}

export default home