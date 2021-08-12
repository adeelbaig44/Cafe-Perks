import React, { Component } from 'react'
import { SafeAreaView, View,
    Text,
    Image,
    TouchableOpacity, ScrollView, } from 'react-native';
import { fonts } from '../Helper/Fonts';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
export default class settingScreen extends Component {
    render() {
        return (
            <SafeAreaView style={{ height: "100%", backgroundColor: "#ffff" }}>
        <ScrollView>
          <View
            style={{
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontFamily: fonts.arial_bold,
                fontSize: 20,
                alignItems: "center",
                width: "100%",
                textAlign: "center",
              }}
            >
              Settings
            </Text>

            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* <Text
                style={{
                  color: "#000",
                  fontFamily: fonts.arial_bold,
                  fontSize: 20,
                  marginTop: hp("2"),
                }}
              >
                {this.name}
              </Text> */}

              {/* <Image
                source={{ uri: this.state.image }}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: "cover",
                  marginTop: hp("2"),
                }}
              /> */}
              {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate("EditProfile")}
                style={{
                  backgroundColor: "#F78985",
                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                  justifyContent: "center",
                }}
              > */}
                {/* <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.arial_bold,
                    fontSize: hp("1.6"),
                  }}
                >
                  EDITER LE PROFIL
                </Text> */}
              {/* </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("editProfile", {});
                }}
                style={{
                  backgroundColor: "#F78985",
                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: hp("1.6"),
                  }}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AddDishs", {});
                }}
                style={{
                  backgroundColor: "#F78985",
                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: hp("1.6"),
                  }}
                >
                  Modify Menu
                </Text>
              </TouchableOpacity>
               <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("addTable", {});
                }}
                style={{
                  backgroundColor: "#F78985",

                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                  justifyContent: "center",

                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: hp("1.6"),
                  }}
                >
                  ADD A TABLE
                </Text>
              </TouchableOpacity> 

              {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Feedback")}
                style={{
                  backgroundColor: "#F78985",
                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.arial_bold,
                    fontSize: hp("1.6"),
                  }}
                >
                  RETOUR D'INFORMATION
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  const rest = await LocalDb.getUserProfile();
                  const params = { active: false };
                  Api.post("resturants/changeStatus/" + rest.id, params);
                  try {
                    await AsyncStorage.setItem("TOKEN", "null")
                    await AsyncStorage.setItem("ID", "null")
                    // console.log('Data successfully saved')
                  } catch (e) {

                    // console.log('Failed to save the data to the storage', e)
                  }
                  await LocalDb.saveUserProfile(null);
                  this.props.Load_User("");
                  
                  // console.log(
                  //   "Dataa.token.deletion",
                  //   this.props.user.usertoken
                  //   );
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: "Welcome" }],
                    });
                   
                }}
                style={{
                  backgroundColor: "#F78985",

                  alignItems: "center",
                  borderRadius: 5,

                  justifyContent: "center",
                  width: wp("44"),
                  height: hp("5.5"),
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: hp("2"),
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: fonts.arial_bold,
                    fontSize: hp("1.6"),
                  }}
                >
                  SE DÉCONNECTER
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
        )
    }
}
