import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, TouchableHighlight, ActivityIndicator,} from 'react-native'

import { Text, FormControl, Button } from 'native-base';
import { TextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import { resturantLogin } from '../../Redux/Reducers/Auth/authActions';
import LocalDb from '../../Helper/LocalDb';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";



class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.emailRef = this.updateRef.bind(this, "email");
    this.passwordRef = this.updateRef.bind(this, "password");
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);
    this.state = {
      email: "usm@gmail.com",
      password: "654321",
      varificationCodeModal: false,
      isLoading: false,
      invalid: false,
      profile: null
    }
  }
   loginFunction() {
    try {
      const { email, password } = this.state;
      const user = {
        username : email,
        password,
      };
      console.log(`user--->`, user)
      try {
        this.props.resturantLogin(user, (res) => {
           LocalDb.saveUserProfile(res)
          // console.log("Login Success responce through CallBack",res)
          // console.log('value check through redux', this.props.profile)
          this.props.navigation.navigate("BottomNavigation")
  
        });
        
      } catch (error) {
        alert('Error', error);
      }
    } catch (error) {
      console.log("error at login screen", error)

    }
    }
  onSubmit() {
    let errors = {};
    let empty = true;
    ["email", "password"].forEach((name) => {
      let value = this[name].value()
      if (!value || value == "" || value == " " || value == "  ") {
        errors[name] = "Should not be empty";
        empty = false;
      } else {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (reg.test(this.state.email) === false) {
          errors["email"] = "Invalid email";
          empty = false;
        } else {
        }
      }
    });
    if (empty) {
      this.loginFunction();
    }
    this.setState({ errors });
  }
  onFocus() {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  }
  onChangeText(text) {
    ["email", "password"]
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }
  renderPasswordAccessory() {
    let { secureTextEntry } = this.state;

    let name = secureTextEntry ? "visibility" : "visibility-off";

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting
      />
    );
  }
  onAccessoryPress() {
    this.setState(({ secureTextEntry }) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }
  updateRef(name, ref) {
    this[name] = ref;
  }
  onSubmitEmail() {
    this.password.focus();
  }
  onSubmitPassword() {
    this.password.blur();
  }
  render() {

    let {
      errors = {},
      secureTextEntry,
      secureTextEntry2,
      ...data
    } = this.state;
    return (
      <KeyboardAvoidingView
      style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <ScrollView>
        <View
            style={{
              top: 0,
              alignItems: "center",
              width: "100%",
              marginTop: 50,
            }}
          >
            <Text
              style={{
                fontSize: hp("3.5%"),
                color: "#F78985",
              }}
            >
              Login
            </Text>
          </View>
          <View style={styles.container23}>
            <TextField
              labelFontSize={hp("1.3%")}
              ref={this.emailRef}
              tintColor="black"
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              labelTextStyle={{
                fontSize: 18,
              }}
              titleTextStyle={{
                color: "#F78985",
              }}
              affixTextStyle={{
                color: "#F78985",
                fontSize: 18,
              }}
              style={{
                color: "#F78985",
                fontSize: 18,
                borderBottomWidth:0,
              }}
              textColor="#F78985"
              baseColor="#F78985"
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEmail}
              returnKeyType="next"
              label="Email-Address"
              error={errors.email}
            />

            <TextField
              labelFontSize={hp("1.3%")}
              ref={this.passwordRef}
              tintColor="black"
              value={this.state.password}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              labelTextStyle={{
                fontSize: 18,
              }}
              titleTextStyle={{
              }}
              affixTextStyle={{
                color: "#F78985",
                fontSize: 18,
              }}
              style={{
                color: "#F78985",
                fontSize: 18,
                borderBottomWidth:0,
              }}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              textColor="#F78985"
              baseColor="#F78985"
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
              onSubmitEditing={this.onSubmitPassword}
              returnKeyType="done"
              label="Password"
              error={errors.password}
              maxLength={20}
              characterRestriction={20}
              renderAccessory={this.renderPasswordAccessory}
            />
          </View>
          <FormControl>
          {this.state.varificationCodeModal ? (
              <TouchableHighlight
                underlayColor="transparent"
                disabled={this.state.isLoading}
              >
                <Text
                  style={{
                    fontSize: 16,
                    width: "100%",
                    textAlign: "center",
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderColor: "green",
                    borderWidth: 1,
                    color: "green",
                  }}
                >
                  Vérifier {name}
                </Text>
              </TouchableHighlight>
            ) : null}
            <Text
              style={{
                alignSelf: "center",
                color: "red",
                marginBottom: "4%",
              }}
            >
              {this.state.invalid ? "E-mail ou mot de passe incorrect" : null}
            </Text>

            {this.state.isLoading ? (
              <ActivityIndicator color={"#F78985"} size={30} />
            ) : (
              <Button style={styles.buttonLogin} block onPress={this.onSubmit}>
                <Text
                  style={{
                    
                    fontSize: hp("2.3%"),
                  }}
                >
                  Login
                </Text>
              </Button>
            )}
          </FormControl>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = state => ({
  profile: state.auth.userProfile
});

export default connect(mapStateToProps, {
  resturantLogin,
})(LoginScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffff",
  },
  signUpSection: {},
  logoImage: {
    width: 200,
    height: 80,
    marginTop: Platform.OS === "ios" ? "15%" : "3%",
    marginBottom: Platform.OS === "ios" ? "5%" : "10%",
    alignSelf: "center",
  },

  inputUsername: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  inputPassword: {
    paddingLeft: 10,
    marginBottom: "4%",
    marginLeft: "8%",
    marginRight: "8%",
    marginTop: 0,
    alignSelf: "center",
  },
  buttonLogin: {
    backgroundColor: "#F78985",
    marginLeft: wp("17%"),
    marginRight: wp("17%"),
    height: hp("7%"),
    borderRadius: 3,
  },
  forgotStyle: {
    color: "#F78985",
    marginTop: "10%",
    alignSelf: "center",
    fontSize: hp("1.7"),
  },
  container23: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },

  navBar1: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D05F73",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  rightIcon: {
    height: 10,
    width: 10,
    resizeMode: "contain",
    backgroundColor: "white",
  },
  main2: {
    flex: 1,
  },
  markerFixed: {
    height: 300,
    width: "100%",
    marginTop: -330,
    position: "absolute",
    top: "100%",
  },

  inputFields: {
    borderRadius: 10,
    paddingLeft: 10,
    margin: "2%",
    marginLeft: 10,
    marginTop: 0,
    alignSelf: "center",
  },

  dividerLine: {
    marginBottom: "7%",
    alignSelf: "center",
    marginTop: "7%",
  },
  headerTitleStyle: {
    textAlign: "center",
    alignSelf: "center",
  },
  buttonSignup: {
    borderRadius: 10,
    backgroundColor: "blue",
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "#3B5999",
  },
  gmailSignup: {
    borderRadius: 10,
    backgroundColor: "blue",
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: 30,
    backgroundColor: "#E80E0D",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    paddingStart: 15,
    paddingEnd: 15,
  },

  modalCloseButton: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    flex: 1,
  },

  modalTopBar: {
    width: "100%",

    backgroundColor: "#F78985",
    paddingStart: 10,
    paddingEnd: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  modalHeadingTitle: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    flex: 1,
    fontSize: hp("2.3"),
  },
  modalContentContainer: {
    width: "100%",
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "white",
  },
});
