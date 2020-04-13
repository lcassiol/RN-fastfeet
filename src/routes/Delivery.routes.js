import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import CreateProblem from '~/pages/Delivery/CreateProblem';
import ListProblems from '~/pages/Delivery/ListProblems';

import DeliveryConfirm from '~/pages/Delivery/Confirm';
import DeliveryDetails from '~/pages/Delivery/Details';

import Dashboard from '~/pages/Delivery/Dashboard';

const Stack = createStackNavigator();

export default function DeliveryRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#fff',
        headerTransparent: true,
      }}
      initialRouteName="Entregas">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Dashboard"
        component={Dashboard}
      />
      <Stack.Screen
        name="Details"
        options={{
          title: 'Detalhes da encomenda',
        }}
        component={DeliveryDetails}
      />
      <Stack.Screen
        name="DeliveryConfirm"
        options={{
          title: 'Confirmar entrega',
        }}
        component={DeliveryConfirm}
      />
      <Stack.Screen
        name="CreateProblem"
        options={{
          title: 'Informar problema',
        }}
        component={CreateProblem}
      />
      <Stack.Screen
        name="ListProblems"
        options={{
          title: 'Visualizar problemas',
        }}
        component={ListProblems}
      />
    </Stack.Navigator>
  );
}
