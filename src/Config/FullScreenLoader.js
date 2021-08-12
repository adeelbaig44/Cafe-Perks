import React, { Component } from "react";
import { Text, View, ActivityIndicator } from "react-native";


export default FullScreenLoader = ({ text }) => (
  <View
    style={{
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      backgroundColor:'white',

    }}
  >
    <ActivityIndicator color={"#F78985"} size={50} />
  </View>
);
