import React, { Component } from "react";
import { Text, View } from "react-native";

import { fonts } from "../Helper/Fonts";

export default noDataText = ({text}) => (
  <View
    style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
  >
    <Text
      style={{
        textAlign: "center",
        marginTop: 55,
        fontFamily: fonts.arial_bold,
        fontSize: 20,
        color: "#bfbfbf",
      }}
    >
      {text}
    </Text>
  </View>
);
