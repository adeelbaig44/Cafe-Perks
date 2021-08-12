import React, { Component } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
  } from "react-native";
  import homeScreen from '../Screens/HomeScreen/index';
  import messageScreen from "../Screens/messageScreen"
  import ordersHistory from '../Screens/HistoryScreen';
  import { StackNavigation } from './stackNavigation';
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  const Tab = createBottomTabNavigator();
export default class BottomNavigation extends Component {
  constructor(props) {
    super(props)
  }
    render() {
        return (
          <View style={{ flex: 1, paddingBottom: 10, backgroundColor: "white" }}>
            <Tab.Navigator
              initialRouteName="homeScreen"
              tabBarOptions={{
                activeTintColor: "#707070",
                activeBackgroundColor: "#F0C5C4",
                tabStyle: { borderRadius: 100, marginTop: 3, marginLeft: 25 },
                style: { height: 100 },
                labelStyle: {
                  marginBottom: 15,
                },
              }}
            >
              <Tab.Screen
                name="homeScreen"
                component={homeScreen}
                options={{
                  tabBarLabel: "Orders",
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: "blue",
                        tintColor: color,
                      }}
                      source={require("../../assets/fork.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="messageScreen"
                component={messageScreen}
                options={{
                  tabBarLabel: "Messages",
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: "blue",
                        tintColor: color,
                      }}
                      source={require("../../assets/msgicon.png")}
                    />
                  ),
                //   tabBarBadge:
                //     orderStore.messageCount > 0 ? orderStore.messageCount : null,
                }}
              />
              <Tab.Screen
                name="ordersHistory"
                component={ordersHistory}
                options={{
                  tabBarLabel: "History",
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: "blue",
                        tintColor: color,
                      }}
                      source={require("../../assets/order.png")}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="StackNavigation"
                component={StackNavigation}
                options={{
                  tabBarLabel: "Settings",
                  tabBarIcon: ({ color, size }) => (
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        tintColor: "blue",
                        tintColor: color,
                      }}
                      source={require("../../assets/user.png")}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </View>
        );
      }
}
