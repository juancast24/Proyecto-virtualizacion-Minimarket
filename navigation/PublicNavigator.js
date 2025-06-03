import { createStackNavigator } from '@react-navigation/stack';
import PublicTabNavigator from './PublicTabNavigator';
import ProductDetailsScreen from '../screens/public/ProductDetailsScreen';
import FormPay from '../screens/public/FormPay';
import SuccessScreen from '../screens/public/SuccessScreen';
import ReciboScreen from '../screens/public/ReciboScreen';
import OrdersScreen from '../screens/user/OrdersScreen';

const Stack = createStackNavigator();

const PublicNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={PublicTabNavigator}/>
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen}/>
      <Stack.Screen name="FormPay" component={FormPay}/>
      <Stack.Screen name="SuccessScreen" component={SuccessScreen}/>
      <Stack.Screen name="ReciboScreen" component={ReciboScreen}/>
      <Stack.Screen name="OrderScreen" component={OrdersScreen}/>
    </Stack.Navigator>
  );
};

export default PublicNavigator;