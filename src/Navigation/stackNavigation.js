import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";
import settingScreen from "../Screens/settingScreen";
import addTable from "../Screens/AddTable/index";
// import Feedback from "../Screen/Feedback";
// import {
//   AddDishs,
//   EditMenu,
//   TablesManagement,
//   AddNewTable,
//   UpdateDish,
// } from "../Index";
const Stack = createStackNavigator();
export const StackNavigation: () => React$Node = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="settingScreen"
        component={settingScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="AddDishs"
        component={AddDishs}
        options={{
          headerShown: false,
        }}
      /> */}

      {/* <Stack.Screen
        name="UpdateDish"
        component={UpdateDish}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditMenu"
        component={EditMenu}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TablesManagement"
        component={TablesManagement}
        options={{
          headerShown: false,
        }}
      />*/}
      <Stack.Screen
        name="addTable"
        component={addTable}
        options={{
          headerShown: false,
        }}
      /> 
    </Stack.Navigator>
  );
};
