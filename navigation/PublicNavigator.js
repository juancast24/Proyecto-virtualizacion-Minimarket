import { createStackNavigator } from '@react-navigation/stack';

import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import SuccessScreen from '../screens/public/SuccessScreen';
import ReciboScreen from '../screens/public/ReciboScreen';
import OrdersScreen from '../screens/user/OrdersScreen';
import HomeScreen from '../screens/public/HomeScreen';
import LoginScreen from '../screens/public/LoginScreen';
import CartScreen from '../screens/public/CartScreen';

const Stack = createStackNavigator();

const PublicNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="CartScreen" component={CartScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen}/>
      <Stack.Screen name="FormPay" component={FormPay}/>
      <Stack.Screen name="SuccessScreen" component={SuccessScreen}/>
      <Stack.Screen name="ReciboScreen" component={ReciboScreen}/>
      <Stack.Screen name="OrderScreen" component={OrdersScreen}/>
    </Stack.Navigator>
  );
};

export default PublicNavigator;