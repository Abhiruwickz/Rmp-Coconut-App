import { View, Text,Image, TouchableOpacity, ActivityIndicator, Dimensions,ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { Real_time_database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';


const screenWidth = Dimensions.get('window').width;

const home = () => {

  const [loading,setLoading] = useState(true);
  const [totalCoconuts,setTotalCoconuts]=useState("0");
  const [totalRejections,setTotalRejections]=useState("0");
  const [sectionData, setSectionData] = useState({
    sectionA: { coconuts: [], rejections: [] },
    sectionB: { coconuts: [], rejections: [] },
    sectionC: { coconuts: [], rejections: [] },
  });

  useEffect(() => {
    // Reference to the coconuts data in Firebase
    const coconutsRef = ref(Real_time_database, 'Coconuts');

    // Fetch data and calculate totals
    onValue(coconutsRef, (snapshot) => {
      const data = snapshot.val();
      let coconutsSum = 0;
      let rejectionsSum = 0;


      const monthlyData = {
        sectionA: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
        sectionB: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
        sectionC: { coconuts: Array(12).fill(0), rejections: Array(12).fill(0) },
      };

      if (data) {
        Object.values(data).forEach((coconut) => {
          const month = new Date(coconut.date).getMonth();
          coconutsSum += parseInt(coconut.noOfNuts, 10) || 0;
          rejectionsSum += parseInt(coconut.rejected, 10) || 0;

           // Categorize by section
           if (coconut.section === 'Section A') {
            monthlyData.sectionA.coconuts[month] += parseInt(coconut.noOfNuts, 10) || 0;
            monthlyData.sectionA.rejections[month] += parseInt(coconut.rejected, 10) || 0;
          } else if (coconut.section === 'Section B') {
            monthlyData.sectionB.coconuts[month] += parseInt(coconut.noOfNuts, 10) || 0;
            monthlyData.sectionB.rejections[month] += parseInt(coconut.rejected, 10) || 0;
          } else if (coconut.section === 'Section C') {
            monthlyData.sectionC.coconuts[month] += parseInt(coconut.noOfNuts, 10) || 0;
            monthlyData.sectionC.rejections[month] += parseInt(coconut.rejected, 10) || 0;
          }
      
        });
      }

      setTotalCoconuts(coconutsSum);
      setTotalRejections(rejectionsSum);
      setSectionData(monthlyData);
      setLoading(false);
    });
  }, []);

   // Combined graph data for coconuts and rejections for sections A, B, C
  const combinedGraphData = {
    labels: [ 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: sectionData.sectionA.coconuts,
        color: () => '#FF0000', // Red for Section A Coconuts
        strokeWidth: 2,
        label: 'Section A Coconuts',
      },
      {
        data: sectionData.sectionB.coconuts,
        color: () => '#00FF00', // Green for Section B Coconuts
        strokeWidth: 2,
        label: 'Section B Coconuts',
      },
      {
        data: sectionData.sectionC.coconuts,
        color: () => '#0000FF', // Blue for Section C Coconuts
        strokeWidth: 2,
        label: 'Section C Coconuts',
      },
      {
        data: sectionData.sectionA.rejections,
        color: () => '#FF99', // Light Red for Section A Rejections
        strokeWidth: 2,
        label: 'Section A Rejections',
      },
      {
        data: sectionData.sectionB.rejections,
        color: () => '#99FF99', // Light Green for Section B Rejections
        strokeWidth: 2,
        label: 'Section B Rejections',
      },
      {
        data: sectionData.sectionC.rejections,
        color: () => '#9999FF', // Light Blue for Section C Rejections
        strokeWidth: 2,
        label: 'Section C Rejections',
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
        <TouchableOpacity>
        <Image source = {require("../../assets/images/notification.png")} className="rounded-lg w-[24px] h-[24px] mt-16 ml-28" />
        </TouchableOpacity>
      </View>
      <Text className="text-lg font-semibold mb-5 text-gray-800 mt-5 ml-4 ">Summary</Text>
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