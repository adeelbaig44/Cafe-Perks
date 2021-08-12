// import React, { Component } from "react";
// import {
//   StyleSheet,
//   View,
//   TouchableHighlight,
//   BackHandler,
//   Image,
//   AsyncStorage,
//   Platform,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   TouchableOpacity,
// } from "react-native";
// import { Button, Text, Form } from "native-base";
// import { signUp } from "../Services/Api";
// import { TextField } from "react-native-material-textfield";
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";
// import LocalDb from "../Helpers/LocalDb";
// import { requestLocationPermission } from "../Helpers/functions";
// import Geolocation from "@react-native-community/geolocation";
// import Api from "../Helpers/Api";
// import FastImage from "react-native-fast-image";

// export class Signup extends Component {
//   constructor(props) {
//     super(props);
//     this.onFocus = this.onFocus.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//     this.onChangeText = this.onChangeText.bind(this);
//     this.onSubmitEmail = this.onSubmitEmail.bind(this);
//     this.onSubmitVcode = this.onSubmitVcode.bind(this);
//     this.onSubmitPassword = this.onSubmitPassword.bind(this);
//     this.onAccessoryPress = this.onAccessoryPress.bind(this);
//     this.firstNameRef = this.updateRef.bind(this, "firstName");
//     this.LastNameRef = this.updateRef.bind(this, "lastName");
//     this.emailRef = this.updateRef.bind(this, "email");
//     this.passwordRef = this.updateRef.bind(this, "password");
//     this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

//     this.state = {
//       firstName: "",
//       lastName: "",
//       secureTextEntry: true,
//       varificationCodeModal: false,
//       vcode: "",
//       email: "",
//       hasFocus: false,
//       emojis: "",
//       hidepass: true,
//       password: "",
//       modalVisible: false,
//       userInfo: null,
//       isLoading: false,
//       modalVisible: false,
//       invalid: false,
//       token: null,
//     };
//   }
//   onFocus() {
//     let { errors = {} } = this.state;

//     for (let name in errors) {
//       let ref = this[name];

//       if (ref && ref.isFocused()) {
//         delete errors[name];
//       }
//     }

//     this.setState({ errors });
//   }

//   onChangeText(text) {
//     ["firstName", "lastName", "email", "password"]
//       .map((name) => ({ name, ref: this[name] }))
//       .forEach(({ name, ref }) => {
//         if (ref.isFocused()) {
//           this.setState({ [name]: text });
//         }
//       });
//   }
//   onAccessoryPress() {
//     this.setState(({ secureTextEntry }) => ({
//       secureTextEntry: !secureTextEntry,
//     }));
//   }
//   onSubmitEmail() {
//     this.password.focus();
//   }
//   onSubmitVcode() {
//     this.vcode.blur();
//   }

//   onSubmitPassword() {
//     this.password.blur();
//   }
//   onSubmit() {
//     let errors = {};
//     let empty = true;
//     ["firstName", "lastName", "email", "password"].forEach((name) => {
//       let value = this[name].value();

//       if (
//         !value ||
//         value == "" ||
//         value == " " ||
//         value == "  " ||
//         value == " "
//       ) {
//         errors[name] = "Should not be empty";
//         empty = false;
//       } else {
//         let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//         if (reg.test(this.state.email) === false) {
//           errors["email"] = "Invalid email";
//           empty = false;
//         } else {
//         }
//       }
//     });
//     if (empty) {
//       this.UserRegister();
//     }
//     this.setState({ errors });
//   }

//   updateRef(name, ref) {
//     this[name] = ref;
//   }

//   renderPasswordAccessory() {
//     let { secureTextEntry } = this.state;

//     let name = secureTextEntry ? "visibility" : "visibility-off";

//     return (
//       <MaterialIcon
//         size={24}
//         name={name}
//         color={TextField.defaultProps.baseColor}
//         onPress={this.onAccessoryPress}
//         suppressHighlighting
//       />
//     );
//   }

//   getCurrentLocation = async () => {
//     Geolocation.getCurrentPosition(
//       async (info) => {
//         // console.log(info);
//         try {
//           const getCurrentLocation = await Api.externalGet(
//             `https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port&lat=${info.coords.latitude}&lon=${info.coords.longitude}`
//           );
//           if (
//             getCurrentLocation.features != undefined &&
//             getCurrentLocation.features.length > 0
//           ) {
//             const city = getCurrentLocation.features[0].properties.city;
//             const currentLocation = {
//               lat: info.coords.latitude,
//               long: info.coords.longitude,
//               city: city,
//             };
//             await LocalDb.saveCurrentLocation(currentLocation);
//           }
//         } catch (error) {}
//       },
//       async (error) => {
//         await LocalDb.saveCurrentLocation(null);
//       }
//     );
//   };

//   UserRegister() {
//     signUp(
//       this.state.firstName,
//       this.state.lastName,
//       this.state.email,
//       this.state.password
//     )
//       .then(async (response) => {
//         // console.log("RESPONSE", response.message);
//         // alert(response? response.message : null);
//         if (response.status == 200) {
//           // Ios auto checks for permission so in that case just call the get location function
//           if (Platform.OS === "ios") {
//             await this.getCurrentLocation();
//             this.props.navigation.navigate("Login", {});
//           } else {
//             // Android requires permission
//             const permissionGranted = await requestLocationPermission(); // First ask for permission
//             if (permissionGranted) {
//               // If accepted then get current location
//               await this.getCurrentLocation();
//               this.props.navigation.navigate("Login", {});
//             } else {
//               // Save null to localStorage If No Permission Was Given
//               await LocalDb.saveCurrentLocation(null);
//               this.props.navigation.navigate("Login", {});
//             }
//           }
//         } else {
//           alert("Error");
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   componentWillUnmount() {
//     BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
//   }

//   handleBackPress = () => {
//     // Actions.pop(); // works best when the goBack is async
//     return true;
//   };
//   async componentDidMount() {
//     BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
//   }

//   setModalVisible(visible) {
//     this.setState({ varificationCodeModal: visible });
//   }

//   UsernameChanged(value) {
//     this.setState({
//       email: value,
//       invalid: false,
//     });
//   }
//   passwordChanged(value) {
//     this.setState({
//       password: value,
//       invalid: false,
//     });
//   }

//   setFocus(hasFocus) {
//     this.setState({ hasFocus });
//   }
//   varifyUser = (vcode) => {
//     this.setState({ loaded: false });
//     fetch(GLOBAL.VARIFY_USER + "?v_code=" + vcode, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((responseJson) => {
//         if (responseJson.status == 301) {
//           this.setState({ loaded: true, vari: false });
//           alert("Your Account is already activated please login");
//         } else if (responseJson.status == 200) {
//           console.log("verifyuser = " + JSON.stringify(responseJson));
//           this.setState({
//             userInfo: responseJson,
//           });
//           if (this.state.userInfo && this.state.userInfo.status == 200) {
//             try {
//               AsyncStorage.setItem(
//                 "userInfo",
//                 JSON.stringify(this.state.userInfo)
//               );
//               this.updateToken();
//             } catch (error) {
//               alert(error);
//             }
//           } else if (
//             this.state.userInfo.status == 401 ||
//             this.state.userInfo.status == 400
//           ) {
//             this.setState({
//               invalid: true,
//             });
//           }
//         }
//       })
//       .catch((error) => {
//         this.setState({
//           isLoading: false,
//         });
//         alert("There is a problem in your network connection");
//       });
//   };
//   render() {
//     let {
//       errors = {},
//       secureTextEntry,
//       secureTextEntry2,
//       ...data
//     } = this.state;
//     return (
//       <View style={styles.container}>
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             marginTop: 50,
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           <Text style={{ fontSize: 25, fontWeight: "bold", color: "#F78985" }}>
//             SUBSCRIBE
//           </Text>
//         </View>

//         <View style={styles.container23}>
//           <TextField
//             ref={this.firstNameRef}
//             tintColor="black"
//             value={this.state.firstName}
//             autoCapitalize="none"
//             autoCorrect={false}
//             labelTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             titleTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             affixTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             style={{ fontFamily: GLOBAL.FONT_FAMILY, color: "#F78985" }}
//             textColor="#F78985"
//             baseColor="#F78985"
//             enablesReturnKeyAutomatically={true}
//             onFocus={this.onFocus}
//             onChangeText={this.onChangeText}
//             returnKeyType="next"
//             label="First Name"
//             error={errors.firstName}
//           />
//           <TextField
//             ref={this.LastNameRef}
//             tintColor="black"
//             value={this.state.lastName}
//             autoCapitalize="none"
//             autoCorrect={false}
//             labelTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             titleTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             affixTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             style={{ fontFamily: GLOBAL.FONT_FAMILY, color: "#F78985" }}
//             textColor="#F78985"
//             baseColor="#F78985"
//             enablesReturnKeyAutomatically={true}
//             onFocus={this.onFocus}
//             onChangeText={this.onChangeText}
//             returnKeyType="next"
//             label="Last Name"
//             error={errors.LastNameRef}
//           />

//           <TextField
//             ref={this.emailRef}
//             tintColor="black"
//             value={this.state.email}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             autoCorrect={false}
//             labelTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             titleTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             affixTextStyle={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               color: "#F78985",
//             }}
//             style={{ fontFamily: GLOBAL.FONT_FAMILY, color: "#F78985" }}
//             textColor="#F78985"
//             baseColor="#F78985"
//             enablesReturnKeyAutomatically={true}
//             onFocus={this.onFocus}
//             onChangeText={this.onChangeText}
//             onSubmitEditing={this.onSubmitEmail}
//             returnKeyType="next"
//             label="Email Address"
//             error={errors.email}
//           />
//           <TextField
//             ref={this.passwordRef}
//             tintColor="black"
//             value={this.state.password}
//             secureTextEntry={secureTextEntry}
//             autoCapitalize="none"
//             autoCorrect={false}
//             labelTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             titleTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             affixTextStyle={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             style={{ fontFamily: GLOBAL.FONT_FAMILY }}
//             enablesReturnKeyAutomatically={true}
//             clearTextOnFocus={false}
//             textColor="#F78985"
//             baseColor="#F78985"
//             onChangeText={this.onChangeText}
//             onFocus={this.onFocus}
//             onSubmitEditing={this.onSubmitPassword}
//             returnKeyType="done"
//             label="Password"
//             error={errors.password}
//             maxLength={20}
//             characterRestriction={20}
//             renderAccessory={this.renderPasswordAccessory}
//           />
//         </View>
//         <Form>
//           {this.state.varificationCodeModal ? (
//             <TouchableHighlight
//               underlayColor="transparent"
//               disabled={this.state.isLoading}
//             >
//               <Text
//                 style={{
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontSize: 16,
//                   width: "100%",
//                   textAlign: "center",
//                   paddingTop: 5,
//                   paddingBottom: 5,
//                   paddingLeft: 10,
//                   paddingRight: 10,
//                   borderColor: "green",
//                   borderWidth: 1,
//                   color: "green",
//                 }}
//               >
//                 {" "}
//                 Verify {name}{" "}
//               </Text>
//             </TouchableHighlight>
//           ) : null}
//           <Text
//             style={{
//               fontFamily: GLOBAL.FONT_FAMILY,
//               alignSelf: "center",
//               color: "red",
//               marginBottom: "4%",
//             }}
//           >
//             {this.state.invalid ? "Invalid email and/or password" : null}
//           </Text>
//           {this.state.isLoading ? (
//             <BarIndicator color="#D05F73" />
//           ) : (
//             <Button style={styles.buttonLogin} block onPress={this.onSubmit}>
//               <Text
//                 style={{
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontSize: 20,
//                 }}
//               >
//                 {" "}
//                 Register Now{" "}
//               </Text>
//             </Button>
//           )}
//         </Form>
//         {/* <View style={styles.signUpSection}>
//           <Text style={styles.dividerLine}>OU</Text>
//           <TouchableOpacity
//             style={styles.buttonSignup}
//             disabled={this.state.isLoading}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 padding: 15,
//               }}
//             >
//               <Image
//                 style={{ resizeMode: "contain", height: 24, width: 24 }}
//                 source={require("../../Assets/facebook.png")}
//               />
//               <Text
//                 style={{
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontSize: 17,
//                   color: "white",
//                   textAlign: "center",
//                   alignItems: "center",
//                   marginLeft: 10,
//                 }}
//               >
//                 CONTINUER AVEC FACEBOOK
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.gmailSignup}
//             disabled={this.state.isLoading}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 padding: 15,
//               }}
//             >
//               <Image
//                 style={{ resizeMode: "contain", height: 24, width: 24 }}
//                 source={require("../../Assets/gmail.png")}
//               />
//               <Text
//                 style={{
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontFamily: GLOBAL.FONT_FAMILY,
//                   fontSize: 17,
//                   color: "white",
//                   textAlign: "center",
//                   alignItems: "center",
//                   marginLeft: 10,
//                 }}
//               >
//                 CONTINUER AVEC GOOGLE
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View> */}
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#ffff",
//   },
//   signUpSection: {},
//   logoImage: {
//     width: 200,
//     height: 80,
//     marginTop: Platform.OS === "ios" ? "15%" : "3%",
//     marginBottom: Platform.OS === "ios" ? "5%" : "10%",
//     alignSelf: "center",
//   },

//   inputUsername: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     borderBottomWidth: 0.5,
//     borderColor: "grey",
//   },
//   inputPassword: {
//     paddingLeft: 10,
//     marginBottom: "4%",
//     marginLeft: "8%",
//     marginRight: "8%",
//     marginTop: 0,
//     alignSelf: "center",
//   },
//   buttonLogin: {
//     backgroundColor: "#F78985",
//     marginLeft: "10%",
//     marginRight: "10%",
//     height: 60,
//   },
//   forgotStyle: {
//     color: "#979799",
//     marginTop: "10%",
//     alignSelf: "center",
//     fontFamily: GLOBAL.FONT_FAMILY,
//   },
//   container23: {
//     marginTop: 10,
//     marginLeft: 15,
//     marginRight: 15,
//   },

//   navBar1: {
//     height: 60,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#D05F73",
//   },
//   leftContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-start",
//   },
//   rightContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },

//   rightIcon: {
//     height: 10,
//     width: 10,
//     resizeMode: "contain",
//     backgroundColor: "white",
//   },
//   main2: {
//     flex: 1,
//   },
//   markerFixed: {
//     height: 300,
//     width: "100%",
//     marginTop: -330,
//     position: "absolute",
//     top: "100%",
//   },

//   inputFields: {
//     borderRadius: 10,
//     paddingLeft: 10,
//     margin: "2%",
//     marginLeft: 10,
//     marginTop: 0,
//     alignSelf: "center",
//   },

//   dividerLine: {
//     marginBottom: "7%",
//     alignSelf: "center",
//     marginTop: "7%",
//     fontFamily: GLOBAL.FONT_FAMILY,
//   },
//   headerTitleStyle: {
//     textAlign: "center",
//     alignSelf: "center",
//   },
//   buttonSignup: {
//     borderRadius: 10,
//     backgroundColor: "blue",
//     marginLeft: "10%",
//     marginRight: "10%",
//     backgroundColor: "#3B5999",
//   },
//   gmailSignup: {
//     borderRadius: 10,
//     backgroundColor: "blue",
//     marginLeft: "10%",
//     marginRight: "10%",
//     marginTop: 30,
//     backgroundColor: "#E80E0D",
//   },
// });
