import { createStackNavigator } from '@react-navigation/stack';
import UserTabNavigator from './UserTabNavigator';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import OrdersScreen from '../screens/user/OrdersScreen';
import SuccessScreen from '../screens/public/SuccessScreen';
import ReciboScreenUser from '../screens/user/ReciboScreenUser';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={UserTabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="ReciboScreen" component={ReciboScreenUser} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
