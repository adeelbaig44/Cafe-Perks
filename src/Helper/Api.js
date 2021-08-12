import { Platform, Alert } from "react-native";
//import { HOST } from "../globals/Strings";
export const host = "https://restaurant.a-table.app";
//export const host = "http://192.168.18.223:4000";

class Api {
  static async headers() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Bearer " +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjNhNzIyN2EyMGNiZDcwMWRkZjAwM2IiLCJpYXQiOjE1OTg1NTc3NTAsImV4cCI6MTU5OTE2MjU1MH0.sRXkENX7XZMsSZfarIiGng6VHR3Glc21gFeEP9673YY",
    };
  }

  static get(route) {
    return this.func(route, null, "GET");
  }
  static post(route, params) {
    return this.func(route, params, "POST");
  }
  static put(route, params) {
    return this.func(route, params, "PUT");
  }

  static async postFormData(endPoint, formdata) {
    console.log(JSON.stringify("At helper api", host + endPoint));
    return fetch(host + endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjNhNzIyN2EyMGNiZDcwMWRkZjAwM2IiLCJpYXQiOjE1OTg1NTc3NTAsImV4cCI6MTU5OTE2MjU1MH0.sRXkENX7XZMsSZfarIiGng6VHR3Glc21gFeEP9673YY",
      },
      body: formdata,
    })
      .then((response) => {
        console.log(`at then`, response);
        let json = response.json();

        if (response.ok) {
          console.log(`Okkk`, json);
          return json;
        }
        // console.log('signup api response',response)
      })
      .catch((err) => {
        console.log(`at catch error`);
        console.log(err);
        return null;
      });
  }

  static async externalGet(route, params, verb) {
    const url = `${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null
    );

    options.headers = await Api.headers();

    return fetch(url, options)
      .then((resp) => {
        // console.log("Api response is ------------->>>>>>", resp);

        let json = resp.json();

        if (resp.ok) {
          return json;
        }
        return json.then((err) => {
          return null;
        });
      })
      .catch((json) => {
        console.log("Api response is ------------->>>>>>", json);
        return null;
      });
  }

  static async func(route, params, verb) {
    const url = `${host}/${route}`;
    // console.log(url);
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null
    );

    options.headers = await Api.headers();

    return fetch(url, options)
      .then((resp) => {
        // console.log("Api response is ------------->>>>>>", resp);

        let json = resp.json();

        if (resp.ok) {
          return json;
        }
        return json.then((err) => {
          return null;
        });
      })
      .catch((json) => {
        // console.log("Api response is ------------->>>>>>", json);

        return null;
      });
  }
}
export default Api;
