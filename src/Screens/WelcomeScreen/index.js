import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { Dimensions } from "react-native";
const {width,height} = Dimensions.get("window")
import styles from "./WelcomeScreenStyle";

export class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const image = require("../../../assets/cafeperks.png");
    const uri = Image.resolveAssetSource(image);
    return (
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
            top: 0,
            position: "absolute",
            marginTop: 50,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "#F78985" }}>
            Welcome
          </Text>
        </View>

        <Image
          style={{width: width, resizeMode: "contain" }}
          source={require("../../../assets/cafeperks.png")}
        />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            position: "absolute",
            bottom: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Signup", {});
            }}
          >
            <View style={styles.loginButtonViewStyle}>
              <Text style={{ fontSize: 20, color: "white" }}>Register</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("LoginScreen", {});
            }}
          >
            <View style={styles.registerButtonViewStyle}>
              <Text style={{ fontSize: 20, color: "#F78985" }}>Login</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
