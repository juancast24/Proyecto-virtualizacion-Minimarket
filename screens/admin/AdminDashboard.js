import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const AdminDashboard = () => {
  return (
    <View>
      <Header />
      <Text>Pantalla de inicio de admin</Text>
    </View>
  );
};

export default AdminDashboard;
