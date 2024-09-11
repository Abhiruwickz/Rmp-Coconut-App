import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';

const SectionA = () => {
  const [loading, setLoading] = useState(true);
  const [coconuts, setCoconuts] = useState([]);

  useEffect(() => {
    // Query to get coconuts for Section A
    const coconutsRef = ref(Real_time_database, 'Coconuts');
    const sectionQuery = query(coconutsRef, orderByChild('section'), equalTo('Section A'));

    // Listen for value changes
    onValue(sectionQuery, (snapshot) => {
      const data = snapshot.val();
      const coconutsList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setCoconuts(coconutsList);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="p-5 bg-white">
      <Text className="text-xl font-bold mb-5">Section A Coconuts</Text>
      {coconuts.length > 0 ? (
        coconuts.map((coconut) => (
          <View key={coconut.id} className="border p-3 rounded-lg mb-4">
            <Text>Date: {coconut.date}</Text>
            <Text>SR/GRN: {coconut.sr_grn}</Text>
            <Text>Weight: {coconut.weight}</Text>
            <Text>No of Nuts: {coconut.noOfNuts}</Text>
            <Text>Rejected: {coconut.rejected}</Text>
            <Text>Supplier: {coconut.supplier}</Text>
            <Text>Vehicle No: {coconut.vehicleNo}</Text>
          </View>
        ))
      ) : (
        <Text>No coconuts found for Section A</Text>
      )}
    </ScrollView>
  );
};

export default SectionA;
