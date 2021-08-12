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
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
import ImagePicker from "react-native-image-crop-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { editprofile } from '../../Redux/Reducers/editProfile/editProfileActions';
import { connect } from 'react-redux';
import ApiRequest from "../../Helper/Api";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import storage from "@react-native-firebase/storage";

class editProfile extends React.Component {
  miltiselectRef = React.createRef(null);

  constructor(props) {
    super(props);
    // console.log(`props`, props)
    this.state = {
      dishs: [],
      query: "",
      uploadImage: null,
      uploadedImageUrl: [],
      source: null,
      speicalItemsTag: [],
      selectedItem: [],
      dish_description: "",
      dish_price: "",
      dishTypeId: "",
      tags: {
        tag: "",
        tagsArray: [],
      },
      dishTypes: [],
      cuisineTypes: [],
      specialItems: [],
      dishTypeName: null,
      cuisineTypeName: null,
      specialItemName: [],

      isLoading: false,
      showDishNameError: false,
      showDishPriceError: false,
      fullscreenLoading: true,
      Tags: [],
      _specialItemName: [],
      profile: null
    };
  }
  updateTagState = (state) => {
    this.setState({
      tags: state,
    });
  };

  async componentDidMount() {
    const filter = await ApiRequest.get("filter");
    // console.log(`filter--->`, filter)
    if (filter.status != undefined && filter.status == 200) {
      const dishTypes = filter.response.dish_type;
      // console.log(`dishTypes --->`, dishTypes)
      const distTypesClone = [];
      dishTypes.forEach((element) => {
        const dish = { label: element.name, value: element.id };
        distTypesClone.push(dish);
      });
      if (distTypesClone.length > 1)
        this.setState({ dishTypeName: distTypesClone[1] });
      this.setState({ dishTypes: distTypesClone });

      const cuisines = filter.response.cuisine_type;
      if (cuisines != null) {
        const cuisinesClone = [];
        cuisines.forEach((element) => {
          const cuisine = { label: element.name, value: element.id };
          cuisinesClone.push(cuisine);
        });
        this.setState({ cuisineTypes: cuisinesClone });
      }

      const specialItems = filter.response.special_items;
      if (specialItems != null) {
        const specialItemsClone = [];
        specialItems.forEach((element) => {
          const specailItem = { label: element.name, value: element.id };
          specialItemsClone.push(specailItem);
        });
        this.setState({ specialItems: specialItemsClone });
        // console.log(`specialItems   ->`, specialItems)
      }
    }
    this.setState({ fullscreenLoading: false });
    // fetch(`${API}`)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     this.setState({ dishs: json, speicalItemsTag: json });
    //   });
  }

  async addDishButton() {
    this.setState({ isLoading: true });
    const resturant = await this.props.profile;
    console.log(`resturant --->`, resturant)
    this.addDish(
      this.state.query,
      this.state.dish_description,
      this.state.source,
      300,
      this.state.dish_price,
      resturant.id
    );
  }

  findFilm = (query) => {
    if (query === "") {
      return [];
    }

    const { dishs } = this.state;
    const regex = new RegExp(`${query.trim()}`, "i");
    return dishs.filter((film) => film.name.search(regex) >= 0);
  };
  async EditUser () {
    formdata = {
      password: "123456",
      newPassword: "654321",
      resturant_image: "https://firebasestorage.googleapis.com/v0/b/cafe-perks.appspot.com/o/IMG_0005.JPG?alt=media&token=78914790-7996-4b08-82a2-8f8f0fb7db2c",
        resturant_desc: "changed data",
        resturant_name: "Usama",
        cuisine_type: "5f6d7f51ced4680746413797",
        resturant_address: "Yvignac-la-Tour",
      resturant_lat: "48.35",
      resturant_lng: "-2.18333",
    //   resturantID: "610232397458a81d4d5ac611",
    };
    console.log("formdata is going to API", formdata);
    // /////// Redux
    try {
      try {
        console.log(`data in try ---> `, formdata)
        this.props.editprofile(formdata, (res) => {
          console.log("profile edited Successfully ",res)
          // this.props.navigation.navigate("BottomNavigation")
        });
      } catch (error) {
        console.log(`error   ---->`, error)
        alert('Error', error);
      }
    } catch (error) {
      console.log("error going to api", error)

    }
  }
  pickImage = () => {
    console.log(`at PICKER`)
    ImagePicker.openPicker({
      compressImageQuality: 0.5,
      multiple: true,
      maxFiles: 1,
    })
      .then((image) => {
        if (Platform.OS == "ios") {
          this.setState({ uploadImage: image[0].sourceURL, source: image });
        } else {
          this.setState({ uploadImage: image[0].path, source: image });
        }
        console.log("image Picked ------>", this.state.uploadImage);
        this.uploadImageToFireBase();
      })
      .catch((error) => {
        console.log(error);
      });
  }; 
  uploadImageToFireBase = async () => {
    const uri = this.state.uploadImage;
    // console.log("Image uri", uri);
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    console.log("uploadUri ", uploadUri, " filename ", filename);

    const task = storage().ref(filename);

    await task.putFile(uploadUri);

    await task.getDownloadURL().then((url) => {
      this.setState({
        uploadedImageUrl: [url],
      });
    });

    console.log(
      "URL of Image uploaded to the bucket, ",
      this.state.uploadedImageUrl
    );
  };

  PicKImageFromCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      // console.log('from camera ', image);
    });
  }

  selectItem = (data) => {
    data.item.isSelect = !data.item.isSelect;

    data.item.selectedClass = data.item.isSelect
      ? styles.selected
      : styles.list;

    const index = this.state.speicalItemsTag.findIndex(
      (item) => data.item.id === item.id
    );

    this.state.speicalItemsTag[index] = data.item;

    this.setState({
      speicalItemsTag: this.state.speicalItemsTag,
    });
    // console.log('data log', data.item);
  };

  render() {
    if (this.state.fullscreenLoading) {
      return <Text>Loading</Text>;
    }
    // console.log(`dishtypes -->`, this.state.dishTypeName)
    const { query } = this.state;
    const dishs = this.findFilm(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const itemNumber = this.state.speicalItemsTag.filter(
      (item) => item.isSelect
    ).length;
    return (
      <TouchableWithoutFeedback
        // onPress={() => this.miltiselectRef.current.close()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{
            height: "100%",
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <SafeAreaView style={{ backgroundColor: "white" }} />
          {/* <Text
          style={{
            fontFamily: fonts.arial_bold,
            fontSize: 20,
            textAlign: "center",
            marginTop: 50,
          }}
        >
          Add Menu
        </Text> */}
          <View style={{ margin: 10, paddingBottom: 30 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                backgroundColor: "white",
              }}
              horizontal={false}
            >
              <View style={{ width: "100%" }}>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.pickImage();
                    }}
                    style={{
                      alignItems: "center",
                      borderColor: "#F78985",
                      borderWidth: 0.5,
                      width: hp("16.5"),
                      justifyContent: "center",
                      marginTop: hp("2"),
                      height: hp("16.5"),
                    }}
                  >
                    {this.state.uploadImage == null ? (
                      <Text style={{ fontSize: 50, color: "#F78985" }}>+</Text>
                    ) : (
                      <Image
                        source={{ uri: this.state.uploadImage }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    )}

                    {this.state.source != null &&
                    this.state.source.length > 1 ? (
                      <View
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                        }}
                      >
                        <Text style={{ fontSize: 50, color: "#F78985" }}>
                          {this.state.source.length - 1 + "+"}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                  <View style={{ marginTop: 15 }} />

                  <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={{
                      marginTop: 20,
                      borderBottomColor: this.state.showDishNameError
                        ? "red"
                        : "#F78985",

                      borderBottomWidth: 0.5,
                      paddingBottom: 4,
                      borderWidth: 0,
                      borderColor: "#FFFFFF",
                      marginRight: 10,
                      width: "80%",
                    }}
                    style={{
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                      color: "#F78985",
                    }}
                    inputContainerStyle={{
                      borderWidth: 0,
                      borderColor: "white",
                    }}
                    data={
                      dishs.length === 1 && comp(query, dishs[0].name)
                        ? []
                        : dishs
                    }
                    defaultValue={query}
                    onChangeText={(text) => {
                      this.setState({ query: text });
                      // console.log("image ------>",dishs[0]);
                    }}
                    placeholder="Nom du plat*"
                    placeholderTextColor={
                      this.state.showDishNameError ? "red" : "#F78985"
                    }
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => this.setState({ query: item.name })}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            marginTop: 15,
                            maringBottom: 15,
                          }}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />

                  <View style={{ marginTop: 15 }} />
                  <DropDownPicker
                    items={this.state.dishTypes}
                    defaultIndex={1}
                    defaultValue={
                      this.state.dishTypeName != null
                        ? this.state.dishTypeName.value
                        : ""
                    }
                    placeholder="Select Dish Type"
                    placeholderTextColor="#F78985"
                    containerStyle={{ height: 60, width: "83%" }}
                    style={{
                      backgroundColor: "white",
                      marginTop: 20,
                      borderWidth: 0,
                      borderBottomColor: "#F78985",
                      borderBottomWidth: 0.5,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                      color: "#F78985",
                    }}
                    placeholderStyle={{
                      color: "#F78985",
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                    }}
                    selectedLabelStyle={{
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                      color: "#F78985",
                    }}
                    dropDownStyle={{ backgroundColor: "#fafafa", height: 100 }}
                    onChangeItem={(item) =>
                      this.setState({
                        dishTypeName: item, // an array of the selected items
                      })
                    }
                  />

                  <View style={{ marginTop: 15 }} />
                  <TextInput
                    placeholder="Prix*"
                    keyboardType="numeric"
                    placeholderTextColor={
                      this.state.showDishPriceError ? "red" : "#F78985"
                    }
                    onChangeText={(text) => this.setState({ dish_price: text })}
                    value={this.state.dish_price}
                    style={{
                      borderBottomColor: this.state.showDishPriceError
                        ? "red"
                        : "#F78985",
                      borderBottomWidth: 0.5,
                      borderWidth: 0,
                      marginTop: 20,
                      padding: 5,
                      color: "#F78985",
                      width: "80%",
                      backgroundColor: "white",
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                    }}
                  />

                  <View style={{ marginTop: 15 }} />

                  <DropDownPicker
                    controller={(instance) =>
                      (this.miltiselectRef.current = instance)
                    }
                    items={this.state.specialItems}
                    // defaultIndex={0}
                    defaultValue={0}
                    placeholder="Article spécial"
                    placeholderTextColor="#F78985"
                    multiple={true}
                    containerStyle={{ height: 60, width: "83%" }}
                    style={{
                      backgroundColor: "white",
                      marginTop: 20,
                      borderWidth: 0,
                      borderBottomColor: "#F78985",
                      borderBottomWidth: 0.5,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                      color: "#F78985",
                    }}
                    placeholderStyle={{
                      color: "#F78985",
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                    }}
                    selectedLabelStyle={{
                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                      color: "#F78985",
                    }}
                    dropDownStyle={{ backgroundColor: "#fafafa", height: 100 }}
                    onChangeItem={(item) => {
                      this.setState({
                        specialItemName: item, // an array of the selected items
                      });
                    }}
                  />

                  <View style={{ marginTop: 15 }} />

                  <TextInput
                    placeholder="La description"
                    placeholderTextColor={"#F78985"}
                    onChangeText={(text) =>
                      this.setState({ dish_description: text })
                    }
                    value={this.state.dish_description}
                    style={{
                      borderColor: "#F78985",
                      marginTop: 20,
                      padding: 5,
                      fontSize: 16,
                      color: "#F78985",
                      borderWidth: 0.5,
                      height: 60,
                      width: "80%",
                      textAlign: "left",
                      justifyContent: "flex-start",

                      // fontFamily: fonts.sfui_text_medium,
                      fontSize: hp("2"),
                    }}
                  />
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  {this.state.isLoading ? (
                    <ActivityIndicator color={"#F78985"} size={30} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.EditUser();
                      }}
                      style={{
                        backgroundColor: "#F78985",
                        alignItems: "center",
                        marginTop: 50,
                        justifyContent: "center",
                        width: 110,
                        height: 50,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        Save
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }

  renderItem = (data) => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}
    >
      {/* {console.log('data class log',data.item.selectedClass)} */}
      <View style={{ flexDirection: "row" }}>
        <View
          style={{ backgroundColor: "white", width: 10, height: 10 }}
        ></View>
        <Text style={data.item.selectedClass}>{data.item.dish_name} </Text>
      </View>
    </TouchableOpacity>
  );
}
const mapStateToProps = state => ({
  profile: state.auth.userProfile
});

export default connect(mapStateToProps, {
    editprofile,
})(editProfile);
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
