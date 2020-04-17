import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import PropTypes from 'prop-types';

import Profile from '~/pages/Profile';
import DeliveryRoutes from '~/routes/Delivery.routes';
import colors from '~/styles/colors';

const Tab = createBottomTabNavigator();
const iconSize = 26;

export default function Dashboard() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        labelStyle: {
          fontSize: 15,
        },
        style: {
          height: 75,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="Entregas"
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="reorder-horizontal" size={iconSize} color={color} />
          ),
        }}
        component={DeliveryRoutes}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Meu Perfil',
          tabBarIcon: ({ color }) => (
            <Icon name="account-circle" size={iconSize} color={color} />
          ),
        }}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
