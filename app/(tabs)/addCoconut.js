import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { ref, push } from 'firebase/database'; 
import { Real_time_database } from '../../firebaseConfig'; 
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerForPushNotificationsAsync, sendPushNotification } from '../notification/pushnotification'; 

const AddCoconut = () => {
  const [form, setForm] = useState({
    date: '',
    sr_grn: '',
    section: '',
    weight: '',
    noOfNuts: '',
    rejected: '',
    supplier: '',
    vehicleNo: '',
  });

  const [selectedSize, setSelectedSize] = useState('Section A'); // Default value
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  

  const handleChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    handleChange('date', currentDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async () => {
    const { sr_grn, section, date, supplier, weight, noOfNuts, rejected, vehicleNo } = form;

    if (!sr_grn || !section || !date || !supplier || !weight || !noOfNuts || !rejected || !vehicleNo) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const coconutsRef = ref(Real_time_database, 'Coconuts');
    push(coconutsRef, form)
      .then(async () => {
        Alert.alert('Success', 'Coconut added successfully');
        console.log('coconut added successfully');
        setForm({
          sr_grn: '',
          section: '',
          date: '',
          supplier: '',
          weight: '',
          noOfNuts: '',
          rejected: '',
          vehicleNo: '',
        });

        // Get the Expo push token
        const expoPushToken = await registerForPushNotificationsAsync(); // Register for push notifications

        // Call sendPushNotification after successful data push
        if (expoPushToken) {
          await sendPushNotification(
            expoPushToken,
            'Coconut Added!',
            `A new coconut has been added to ${section}.`
          );
          console.log('Push notification sent successfully');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to add coconut. Please try again.');
        console.error('Error adding coconut:', error);
      });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 p-7 bg-white">
        <View className="mt-10">
          <View className="flex flex-row items-center justify-center border-opacity-40 rounded-lg">
            <Text className="bg-orange-500 rounded-lg p-2 w-[151px] text-xl font-bold text-center text-white mb-4">Add Coconuts</Text>
          </View>

          {/* Date Picker */}
          <View className="mb-4">
            <Text>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View className="border border-gray-300 p-2 rounded mt-4">
                <Text>{date.toISOString().split('T')[0]}</Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* SR/GRN Input */}
          <View className="mb-4">
            <Text>SR/GRN</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.sr_grn}
              onChangeText={(text) => handleChange('sr_grn', text)}
            />
          </View>

          {/* Product Size Picker */}
          <View className="mb-4">
            <Text>Section</Text>
            <View className="border border-y-slate-600 rounded-lg mt-4">
              <Picker
                selectedValue={selectedSize}
                onValueChange={(itemValue) => {
                  setSelectedSize(itemValue);
                  handleChange('section', itemValue);
                }}
              >
                <Picker.Item label="Section A" value="Section A" />
                <Picker.Item label="Section B" value="Section B" />
                <Picker.Item label="Section C" value="Section C" />
              </Picker>
            </View>
          </View>

          {/* Weight Input */}
          <View className="mb-4">
            <Text>Weight</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.weight}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('weight', text)}
            />
          </View>

          {/* Supplier Input */}
          <View className="mb-4">
            <Text>Supplier Name</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.supplier}
              onChangeText={(text) => handleChange('supplier', text)}
            />
          </View>

          {/* No of Nuts Input */}
          <View className="mb-4">
            <Text>No of Nuts</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.noOfNuts}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('noOfNuts', text)}
            />
          </View>

          {/* Rejected Input */}
          <View className="mb-4">
            <Text>Rejected Quantity</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.rejected}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('rejected', text)}
            />
          </View>

          {/* Vehicle No Input */}
          <View className="mb-4">
            <Text>Vehicle No</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.vehicleNo}
              onChangeText={(text) => handleChange('vehicleNo', text)}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-orange-500 rounded-lg p-3 w-40 text-center ml-20 mt-5"
            onPress={handleSubmit}
            disabled={loading} // Disable while loading
          >
            <Text className="text-white text-center font-semibold">{loading ? 'Adding...' : 'Add Product'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddCoconut;
