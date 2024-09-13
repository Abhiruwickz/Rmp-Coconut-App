import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator,TouchableOpacity,Alert,Image } from 'react-native';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';
import { router } from 'expo-router';

const SectionC = () => {
  const [loading, setLoading] = useState(true);
  const [coconuts, setCoconuts] = useState([]);

  useEffect(() => {
    // Query to get coconuts for Section A
    const coconutsRef = ref(Real_time_database, 'Coconuts');
    const sectionQuery = query(coconutsRef, orderByChild('section'), equalTo('Section C'));

    // Listen for value changes
    onValue(sectionQuery, (snapshot) => {
      const data = snapshot.val();
      const coconutsList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setCoconuts(coconutsList);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this coconut?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            const coconutRef = ref(Real_time_database, `Coconuts/${id}`);
            remove(coconutRef)
              .then(() => {
                alert('Coconut deleted successfully');
                console.log('Coconut deleted successfully');
                // Optionally, you can refresh the list after deletion
                setCoconuts(coconuts.filter(coconut => coconut.id !== id));
              })
              .catch((error) => {
                console.error('Error deleting coconut:', error);
                console.log('Error deleting coconut:', error);
              });
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-xl font-bold mb-5">Section C Coconuts</Text>
      {coconuts.length > 0 ? (
        coconuts.map((coconut) => (
          <View key={coconut.id} className="border p-3 rounded-lg mb-4">
            <TouchableOpacity onPress={() => handleDelete(coconut.id)} className="ml-64 w-[50px] h-[50px]">
              <Image source={require('../../assets/images/delete.png')} className="w-[24px] h-[24px]" />
            </TouchableOpacity>
            <Text>Date: {coconut.date}</Text>
            <Text>SR/GRN: {coconut.sr_grn}</Text>
            <Text>Weight in Kg: {coconut.weight}</Text>
            <Text>No of Nuts: {coconut.noOfNuts}</Text>
            <Text>Rejected: {coconut.rejected}</Text>
            <Text>Supplier: {coconut.supplier}</Text>
            <Text>Vehicle No: {coconut.vehicleNo}</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: "../updateSectionC", params: { id: coconut.id, coconut }  })} className="rounded-lg bg-red-300 h-[30px] w-[70px] ml-56 ">
              <Text className="text-center mt-1 font-semibold ">Update </Text>
               
              </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No coconuts found for Section C</Text>
      )}
    </ScrollView>
  );
};

export default SectionC;
