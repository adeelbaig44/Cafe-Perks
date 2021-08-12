import { PermissionsAndroid } from "react-native";
import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Access Camera",
        message: "Need To Access Camera " + "to search nearby restaurants.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      return true;
    } else {
      return false;
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
export function getCurrentDate() {
  var today = new Date();
  var today =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  return today;
}

export function getCurrentDateWithDay() {
  var daylist = [
    "Sunday",
    "Monday",
    "Tuesday ",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var today = new Date();
  var today =
    daylist[today.getDay()] +
    // "," +
    // today.getDate() +
    " " +
    today.getDate() +
    " " +
    monthList[today.getMonth()] +
    ", " +
    today.getFullYear();
  return today;
}
