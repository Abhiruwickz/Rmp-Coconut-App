import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import { Real_time_database } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MailComposer from 'expo-mail-composer';
import { router } from 'expo-router';

const AddCoconut = () => {
  const [form, setForm] = useState({
    date: '',
    sr_grn: '',
    section: '',
    weight: '',
    weight2: '',
    noOfNuts: '',
    rejected: '',
    supplier: '',
    vehicleNo: '',
  });

  const [selectedSize, setSelectedSize] = useState('Section A'); // Default value
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [userEmails, setUserEmails] = useState([]); // State to store user emails

  useEffect(() => {
    // Fetch user emails from Firebase
    const usersRef = ref(Real_time_database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const emails = Object.values(usersData || {}).map((user) => user.email);
      setUserEmails(emails);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    handleChange('date', currentDate.toISOString().split('T')[0]);
  };

  const notifyUsers = async () => {
    const emailBody = `
      A new coconut has been added with the following details:
      
      - SR/GRN: ${form.sr_grn}
      - Section: ${form.section}
      - Date: ${form.date}
      - Supplier: ${form.supplier}
      - Weight: ${form.weight}
      - Weight2: ${form.weight2}
      - No of Nuts: ${form.noOfNuts}
      - Rejected: ${form.rejected}
      - Vehicle No: ${form.vehicleNo}
    `;
   

    try {
      await MailComposer.composeAsync({
        recipients: userEmails,
        subject: 'New Coconut Added',
        body: emailBody,
      });
      console.log('Notification emails sent successfully');
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  const handleSubmit = async () => {
    const { sr_grn, section, date, supplier, weight, weight2, noOfNuts, rejected, vehicleNo } = form;

    if (!sr_grn || !section || !date || !supplier || !weight || !noOfNuts || !vehicleNo) {
      Alert.alert('Error', 'fields are required');
      return;
    }

    setLoading(true); // Start loading

    try {
      const coconutsRef = ref(Real_time_database, 'Coconuts');
      await push(coconutsRef, form);
      Alert.alert('Success', 'Coconut added successfully');
      console.log('Coconut added successfully');

      // Send notifications to users
      await notifyUsers();

      // Reset form
      setForm({
        sr_grn: '',
        section: '',
        date: '',
        supplier: '',
        weight: '',
        weight2: '',
        noOfNuts: '',
        rejected: '',
        vehicleNo: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add coconut. Please try again.');
      console.error('Error adding coconut:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 p-7 bg-white">
        <View className="mt-10">
          <View className="flex flex-row items-center justify-center border-opacity-40 rounded-lg">
            <Text className="bg-orange-500 rounded-md p-2 w-[150px] text-lg font-bold text-center text-white mb-5">Add Coconuts </Text>
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
            <Text>1st Weight</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.weight}
              keyboardType="numeric"
              onChangeText={(text) => handleChange('weight', text)}
            />
          </View>

           {/* Weight Input */}
           <View className="mb-4">
            <Text>2nd Weight</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mt-4"
              value={form.weight2}
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
            className="bg-orange-500 rounded-lg p-3 w-40 text-center ml-16 mt-5"
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
