import React, { Component } from 'react'
import {
    View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native'

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import Api from '../../Helper/Api';
import RNFS from "react-native-fs"
import { host } from '../Helper/Api';
import { addnewTable } from '../../Redux/Reducers/TablesManagment/addTableActions';
import RNFetchBlob from 'rn-fetch-blob';
import LocalDb from '../../Helper/LocalDb';
import storage from '@react-native-firebase/storage'
class addTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tableNum: "",
          url: "https://www.google.com",
          isLoading: false,
          data: null,
          newData: null,
          qrcodeBase64: null,
          loadingText: "",
          qrCodeValue: " ",
          qrImg: "",
          uploadedImageUrl: "",
          path: "",
          UrlLink: "http://onelink.to/tablec",
          isQRScaned: false,
        };
      }

      getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log(
          "Rendered,",
          { prev: prevState.qrCodeValue, current: this.state.qrCodeValue },
          prevState.qrCodeValue != this.state.qrCodeValue
        );
        if (prevState.qrCodeValue != this.state.qrCodeValue)
          setTimeout(() => {
            this.QRSave();
          }, 0);
        return null;
      }
      uploadImageToFireBase = async (data) => {
        this.setState({ isLoading: true });
    
        const uri = data;
        console.log("Image uri", uri);
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
        console.log("uploadUri ", uploadUri, " filename ", filename);
        try {
          const task = storage().ref(filename);
    
          await task.putFile(uploadUri);
    
          await task.getDownloadURL().then((url) => {
            console.log("I AM HERE", url);
            this.setState({
              uploadedImageUrl: url,
              isLoading: false,
            });
          });
    
          console.log(
            "URL of Image uploaded to the bucket, ",
            this.state.uploadedImageUrl
          );
        } catch (error) {
          console.log("error", error);
        }
        // const task = storage().ref(filename);
    
        // await task.putFile(uploadUri);
    
        // await task.getDownloadURL().then((url) => {
        //   console.log("I AM HERE", url);
        //   this.setState({
        //     uploadedImageUrl: url,
        //     //isLoading: false,
        //   });
        // });
    
        // console.log(
        //   "URL of Image uploaded to the bucket, ",
        //   this.state.uploadedImageUrl
        // );
      };
      generateQrCode = async (params) => {
        this.setState({ loadingText: "Generating QR Code" });
      };
      setParameters = (obj) => {
        console.log(
          "QQQQRRRR",
          this.state.UrlLink +
            "?" +
            Object.keys(obj)
              .map((key, index) => {
                return `${key}=${obj[key]}`;
              })
              .join("&")
        );
        return (
          this.state.UrlLink +
          "?" +
          Object.keys(obj)
            .map((key, index) => {
              return `${key}=${obj[key]}`;
            })
            .join("&")
        );
      };
      saveTable = async () => {
        const scope = this;
        this.setState({ isLoading: true, loadingText: "Creating Table" });
    
        const restaurnt = await LocalDb.getUserProfile();
        console.log("Resturant", JSON.stringify(restaurnt, null, 2));
        console.log("Resturant ID 1", restaurnt.id);
        const restaurantId = restaurnt.id;
        console.log("Resturant ID 2", restaurantId);
        const params = {
          resturant_id: restaurantId,
          table_number: this.state.tableNum,
          table_url: this.state.url,
        };
    
        // Save a new table
    
        // const response = await Api.post("tables/register", params);
        var response
        try {
          this.props.addnewTable(params, (res) => {
             response = res
            console.log("table added Successfully ",res)
    
          });
          
        } catch (error) {
          alert('Error', error);
        }
    
        if (response != null) {
          // If success then get the table id and update the database with qr code image
          const data = response.resturantData;
    
          const qrCodeParams = {
            tableNumber: data.table_number,
            tableUrl: data.table_url,
            restaurantName: restaurnt.resturant_name,
            restaurantID: restaurnt.id,
            TableID: data.id,
          };
          var qrString = await this.setParameters(qrCodeParams);
          console.log("aaaaaaaaaaaaa", { qrString });
          await this.setState(
            {
              loadingText: "Generating QR Code",
              // qrCodeValue: JSON.stringify(qrCodeParams), //Give Qr Image a value
              qrCodeValue: qrString, //Give Qr Image a value
              newData: data,
            }
          );
        } else {
          this.setState({ isLoading: false, loadingText: "" });
          alert("Le numéro de table existe déjà vvvvvvvvv ");
        }
    
        this.setState({ tableNum: "", isLoading: false, loadingText: "" });
      };
      QRSave() {
        this.svg.toDataURL(async (qr) => {
          console.log("QWR", qr);
          await this.setState({
            qrcodeBase64: qr,
            loadingText: "Saving Data",
          });
          //await this.saveToDownloads();
          let a = await this.saveToDownloads();
          // console.log("Save step 1", this.state.path);
          // console.log("Save step 2", a);
          await this.uploadImageToFireBase(this.state.path);
          console.log("Step 2");
          const params = {
            qrCode: this.state.uploadedImageUrl,
          };
          console.log("PARAMS", params);
          // Update the table with Qr Code
          const update = await Api.put("tables/" + this.state.newData.id, params);
    
          if (update != null) {
            alert("La table a été ajoutée");
            this.setState({ isLoading: false, loadingText: "" });
            setTimeout(() => {}, 4000);
            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "TablesManagement", params: {} }],
            });
          } else {
            this.setState({ isLoading: false, loadingText: "" });
    
            alert("Quelque chose s'est mal passé");
          }
          //await this.updateTable();
        });
      }
      saveToDownloads = async () => {
        console.log("THIS>STATE", this.state.qrcodeBase64);
        const fileName = new Date().getMilliseconds();
        if (Platform.OS == "ios") {
          const imagePath = `${RNFS.DocumentDirectoryPath}/${fileName}.png`;
          RNFS.writeFile(imagePath, this.state.qrcodeBase64, "base64").then(() => {
            console.log("Image converted to jpg and saved at " + imagePath);
          });
          this.setState({ path: imagePath });
          return imagePath;
        }
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "External Storage",
              message:
                "This app wants access to external storage. " +
                "so you can save table Qr Codes.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const dirs = RNFetchBlob.fs.dirs;
            //const imagePath = `${RNFS.DocumentDirectoryPath}/${fileName}.png`;
            const imagePath = `${dirs.DCIMDir}/${fileName}.png`;
            console.log("QR111", this.state.qrcodeBase64);
            RNFetchBlob.fs
              .writeFile(imagePath, this.state.qrcodeBase64, "base64")
              .then(() => {
                console.log("Image converted to jpg and saved at " + imagePath);
              });
            this.setState({ path: imagePath });
            return imagePath;
          } else {
            console.log("Camera permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };
      updateTable = async () => {
        this.setState({ isLoading: true });
        const restaurnt = await LocalDb.getUserProfile();
    
        const restaurantId = restaurnt.id;
    
        const qrCodeParams = {
          tableNumber: this.state.tableNum,
          tableUrl: this.state.url,
          restaurantName: restaurnt.resturant_name,
          restaurantID: restaurnt.id,
          TableID: this.state.data.id,
        };
        await this.setState({
          loadingText: "Generating QR Code",
          qrCodeValue: JSON.stringify(qrCodeParams, null, 2),
        });
        this.svg.toDataURL(async (qr) => {
          console.log("Step 1");
          await this.saveToDownloads();
          console.log("Step 2");
          await this.setState({ qrcodeBase64: qr, loadingText: "Saving Data" });
          console.log("Step 3");
          console.log("restaurantId", restaurantId);
          console.log("this.state.tableNum", this.state.tableNum);
          console.log("this.state.url", this.state.url);
          console.log("this.state.qrcodeBase64", this.state.qrcodeBase64);
          console.log("this.state.data.id", this.state.data.id);
          const params = {
            resturant_id: restaurantId,
            table_number: this.state.tableNum,
            table_url: this.state.url,
            qrCode: this.state.qrcodeBase64,
          };
          console.log("Step 4");
          const response = await Api.put("tables/" + this.state.data.id, params);
          console.log("RESPONSEEE", JSON.stringify(response, null, 2));
          if (response != null) {
            this.setState({ isLoading: false, loadingText: "" });
            alert("Table mise à jour");
            this.props.navigation.goBack();
            //  alert(response.message);
          } else {
            this.setState({ isLoading: false, loadingText: "" });
            alert("Le numéro de table existe déjà  ");
          }
    
          this.setState({
            url: "https://www.google.com",
            tableNum: "",
            isLoading: false,
            loadingText: "",
          });
        });
      };
    render() {
        return (
          <View
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            padding: 10,
          }}
          >
              <TouchableOpacity
              style={{ marginTop: 20 }}
            //   onPress={() => this.props.navigation.goBack()}
              >
                  <MaterialCommunityIcons
                  style={{
                    fontSize: 30,
                    marginLeft: 10,
                    marginTop: 15,
                    color: "#F78985",
                  }}
                  name="keyboard-backspace"
                  />
              </TouchableOpacity>
              <KeyboardAvoidingView>
                  <SafeAreaView/>
                  <Text
                  style={{
                    fontSize: hp("2.3"),
                    textAlign: "center",
                  }}
                  >
                      ADD A TABLE
                  </Text>
                  <View
                  style={{
                    margin: 50,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingStart: 15,
                    paddingEnd: 15,
                  }}
                  >
                      <View style={{ flexDirection: "column", width: "100%" }}>
                          <TextInput
                          placeholder="Table Number"
                          placeholderTextColor={"#F78985"}
                          keyboardType="number-pad"
                          onChangeText={(text) => this.setState({ tableNum: text })}
                          value={this.state.tableNum}
                          style={{
                            borderBottomColor: "#F78985",
                            borderBottomWidth: 0.5,
                            borderWidth: 0,
                            marginTop: 20,
                            padding: 5,
                            color: "#F78985",
                            fontSize: hp(2),
                            width: "100%",
                            backgroundColor: "white",
                          }}
                          />
                          <View style={{ width: "100%", alignItems: "center", marginTop: 30 }}>
                          {this.state.isLoading ? (
                  <ActivityIndicator color={"#F78985"} size={30} />
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      if (this.state.tableNum.length == 0) {
                        alert("The table number is mandatory");
                        return;
                      }
                      //this.getDataURL();
                      if (this.state.data != null) {
                        await this.updateTable();
                      } else await this.saveTable();
                    }}
                    style={{
                      backgroundColor: "#A583F7",
                      alignItems: "center",
                      justifyContent: "center",
                      height: hp(5),
                      paddingStart: 15,
                      paddingEnd: 15,
                      marginTop: 20,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: hp("2.3"),
                        color: "white",
                      }}
                    >
                      {this.state.data != null ? "Update" : "Save"}
                    </Text>
                  </TouchableOpacity>
                )}
                <Text
                style={{
                    marginTop: 15,
                    color: "gray",
                    fontSize: hp("2.5"),
                  }}
                >
                    {this.state.loadingText}
                </Text>
                {
                    <View style={{}}>
                        <QRCode
                        value={this.state.qrCodeValue}
                        getRef={(c) => (this.svg = c)}
                        />
                    </View>
                }
                          </View>
                      </View>
                  </View>
              </KeyboardAvoidingView>
          </View>  
        )
    }
}
const mapStateToProps = state => ({
  profile: state.auth.userProfile
});

export default connect(mapStateToProps, {
  addnewTable
})(addTable);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#192338",
      paddingVertical: 50,
      position: "relative",
    },
    title: {
      fontSize: 20,
      color: "#fff",
      textAlign: "center",
      marginBottom: 10,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    list: {
      color: "black",
      marginTop: 10,
      marginLeft: 10,
    },
    lightText: {
      color: "#F78985",
      width: 200,
      marginLeft: 5,
      paddingLeft: 15,
      fontSize: 12,
    },
    line: {
      height: 0.5,
      width: "100%",
      backgroundColor: "rgba(255,255,255,0.5)",
    },
    icon: {
      position: "absolute",
      bottom: 20,
      width: "100%",
      left: 290,
      zIndex: 1,
    },
    numberBox: {
      position: "absolute",
      bottom: 75,
      width: 30,
      height: 30,
      borderRadius: 15,
      left: 330,
      zIndex: 3,
      backgroundColor: "#e3e3e3",
      justifyContent: "center",
      alignItems: "center",
    },
    number: { fontSize: 14, color: "#000" },
    selected: {
      color: "#FA7B5F",
    },
  });
  