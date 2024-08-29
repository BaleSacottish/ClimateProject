import { View, Text } from 'react-native'
import React from 'react'

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Tabsbottom from './tabsbottom';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    presentation: 'modal',
                }}>
                <Stack.Screen name='Tabs ' component={Tabsbottom} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation