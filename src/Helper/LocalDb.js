import AsyncStorage from "@react-native-community/async-storage";
class LocalDb {
  static async saveUserProfile(data) {
    // console.log('saving profile in local db', data)
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(data));
      // console.log("From local db", JSON.stringify(data));
    } catch (error) {
      // Error retrieving data
      // console.warn(error.message);
    }
  }
  static async saveCurrentStatus(data) {
    // console.log('saving profile in local db', data)
    try {
      await AsyncStorage.setItem("status", JSON.stringify(data));
    } catch (error) {
      // Error retrieving data
      // console.warn(error.message);
    }
  }
  static async setToken(data) {
    try {
      await AsyncStorage.setItem("userToken", data);
      console.log("Token setted in db", data);
    } catch (error) {
      console.log("Error to set data"); // console.warn(error.message);
    }
  }

  static async setId(data) {
    try {
      await AsyncStorage.setItem("userid", data);
      console.log("ID setted in db", data);
    } catch (error) {
      console.log("Error to set data");
      // console.warn(error.message);
    }
  }
  static async getId(data) {
    try {
      await AsyncStorage.getItem("userid", data);
      console.log("id retrieved", data);
    } catch (error) {
      console.log("Error to set data"); // console.warn(error.message);
    }
  }

  static async getCurrenStatus() {
    let item = {};
    try {
      item = (await AsyncStorage.getItem("status")) || null;
      const userProfile = JSON.parse(item);
      //    console.log('getting profile in local db',userProfile)

      return userProfile;
    } catch (error) {
      //  console.warn(error.message);
    }
    return null;
  }

  static async getUserProfile() {
    let item = {};
    try {
      item = (await AsyncStorage.getItem("profile")) || null;
      const userProfile = JSON.parse(item);
      return userProfile;
    } catch (error) {
      //  console.warn(error.message);
      console.log("get userProfile", error.message);
    }
    return null;
  }
  static async saveCurrentLocation(data) {
    // console.log('saving profile in local db', data)
    try {
      await AsyncStorage.setItem("location", JSON.stringify(data));
    } catch (error) {
      // Error retrieving data
    }
  }

  static async getCurrentLocation() {
    let item = {};
    try {
      item = (await AsyncStorage.getItem("location")) || null;
      const userProfile = JSON.parse(item);
      //    console.log('getting profile in local db',userProfile)

      return userProfile;
    } catch (error) {
      //  console.warn(error.message);
    }
    return null;
  }
}

export default LocalDb;
