import { createStackNavigator } from '@react-navigation/stack';

import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import OrdersScreen from '../screens/user/OrdersScreen';
import SuccessScreen from '../screens/public/SuccessScreen';
import ReciboScreenUser from '../screens/user/ReciboScreenUser';
import CartScreen from '../screens/public/CartScreen';
import HomeScreen from '../screens/public/HomeScreen';
import ProductsScreen from '../screens/user/ProductsScreen';
import OrderHistory from '../screens/user/OrderHistory';
import AccountScreen from '../screens/user/AccountScreen';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} /> 
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="FormPay" component={FormPay} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="ReciboScreen" component={ReciboScreenUser} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
