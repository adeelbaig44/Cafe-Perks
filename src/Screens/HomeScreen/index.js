import React, { Component } from 'react'
import { Text, View,StyleSheet, SafeAreaView, FlatList, TouchableOpacity} from 'react-native'

import { getOrders } from '../../Redux/Reducers/HomeScreen/homeScreenActions';
import { connect } from 'react-redux';
import { getCurrentDateWithDay } from '../../Config/functions';
import NoPastOrders from '../../Config/NoDataText'
import { EventRegister } from "react-native-event-listeners";
import { ScrollView } from 'react-native-gesture-handler';
import { toCompleteOrder } from '../../Redux/Reducers/HomeScreen/homeScreenActions';
import { withSocketContext } from '../../Config/Socket/SocketContext';
import moment from 'moment';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";

class homeScreen extends Component {
    constructor (props){
        super(props),
        this.state = {
            listen: "",
      getCompleteOrders: [],
      getLiveOrders: [],
      showNoLiveOrder: false,
      showNoPastOrder: false,
      isLoading: true,
      showTransparentLoader: false,
            profile: null,
            allOrders: null,
        }
        this.getAllCompleteOrders();
    }
    componentWillUnmount() {
        const { socket } = this.props;
        if (socket != undefined) {
            socket.removeListener(
              this.restaurantId + "food-ordered",
              this.foodOrderedListener
            );
            socket.removeListener(
              this.restaurantId + "append-table",
              this.appendTableListener
            );
          }
          if (this.pusher != undefined) {
            this.pusher.unbind();
            this.pusher.unsubscribe();
          }
          if (this.chatChannel != undefined) {
            this.chatChannel.unbind();
            this.chatChannel.unsubscribe();
          }
    }
    appendTableListener = async (message) => {
        if (message != null && message != undefined) {
          if (message.message != null && message.message != undefined) {
            if (message.message.chats_id.length > 0) {
              const tableNumber = message.message.table_number;
              const tableId = message.message.chats_id[0].table_id;
              const createdDate = message.message.createdDate;
              const userId = message.message.users_id[0].id;
              const type = "table";
              const name =
                message.message.users_id[0].firstName +
                " " +
                message.message.users_id[0].lastName;
              const table = {
                tableNumber,
                tableId,
                createdDate,
                type,
                name,
                userId,
              };
              await this.setState({
                // getCompleteOrders: this.state.getCompleteOrders.concat(table),
              });
            }
          }
        }
      };
    foodOrderedListener = async (message) => {
        return await this.getAllCompleteOrders();
      };
    getAllCompleteOrders = async () => {
        let hasLiveOrder = false;
        let hasPastOrder = false;
        const restaurant = await this.props.profile.id;
        this.restaurantId = restaurant;
        const token = await this.props.profile.token
    
        try {
            this.props.getOrders(restaurant, token, () => {
                // console.log('Orders ', this.props.allOrders)
                res = this.props.allOrders
                if (res != null && res.orderDetail != undefined) {
                    res.orderDetail.map((item, index) => {
                      if (item.order_status == 1) {
                        hasLiveOrder = true;
                      }
                      if (item.order_status == 3) {
                        hasPastOrder = true;
                      }
                    });
                  }
          
                  this.setState({
                    getCompleteOrders: res.orderDetail,
                    showNoLiveOrder: !hasLiveOrder,
                    showNoPastOrder: !hasPastOrder,
                    isLoading: false,
                  });
                  if (res.orderDetail != undefined && res.orderDetail.length == 0) {
                    this.setState({
                      showNoLiveOrder: true,
                      showNoPastOrder: true,
                    });
                  }
            })
        } catch (error) {
            console.log('error in home screen fetching api')
        }
      };
    // async fetchOrders () {
    //     const restaurant = await this.props.profile.id;
    //     const token = await this.props.profile.token
    //     try {
    //         this.props.getOrders(restaurant, token, () => {
    //             // console.log('Orders', this.props.allOrders)
    //         })
    //     } catch (error) {
    //         console.log('error in home screen fetching api')
    //     }
    // }
    componentDidMount= async()=>{
        
        const restaurant = await this.props.profile.id;
        this.restaurantId = restaurant;
        console.log("Resturant1", restaurant);
    console.log("Resturant2", this.restaurantId);
    const { socket } = this.props;
    // console.log('socket',this.props)
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      this.getAllCompleteOrders();
    });
    this.getAllCompleteOrders();
    socket.on(restaurant.id + "food-ordered", this.foodOrderedListener);
    
    socket.on(restaurant.id + "append-table", this.appendTableListener);
    }

    toCompete = async (id) => {
      this.setState({ showTransparentLoader: true });
      const restaurantid =  this.props.profile.id;
      const token =  this.props.profile.token
      try {
        this.props.toCompleteOrder(restaurantid, token, "3", (res) => {
          console.log('success' )
          if (res.status == 200) {
             this.getAllCompleteOrders();
            this.setState({ showTransparentLoader: false });
          }
        })
      } catch (error) {
        console.log(error)
        this.setState({ showTransparentLoader: false });
      }
    };
    componentWillMount() {
        this.listener = EventRegister.addEventListener("myCustomEvent", (data) => {
          this.setState({
            listen: data,
          });
          this.getAllCompleteOrders();
        });
      }
    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "white" }}>
                <View style={{
            height: "100%",
            padding: 10,
            alignItems: "center",
            backgroundColor: "white",
            completeOrders: [],
            inCompleteOrders: [],
          }}>
              <View>
                  <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                      {getCurrentDateWithDay()}
                  </Text>
              </View>
              <View style={{ flexDirection: "column", width: "100%" }}>
                  <View style={{ width: "100%", height: "50%" }}>
                  {this.state.showNoLiveOrder ? (
                <NoPastOrders text={"No Order"} />
              ) : null}
              <FlatList
                data={
                  this.state.getCompleteOrders
                    ? this.state.getCompleteOrders.reverse()
                    : null
                }
                keyExtractor={(item) => item.id + item.name}
                renderItem={this.renderItems}
                onEndReachedThreshold={0.03}
              />
                  </View>
              
              <View
              style={{
                alignItems: "center",
                width: "100%",
                height: 0.5,
                backgroundColor: "gray",
                justifyContent: "center",
              }}
            ></View>
            {this.state.showNoPastOrder ? (
              <NoPastOrders text={"No Order"} />
            ) : null}
            <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
                height: "50%",
              }}
            >
                <FlatList
                data={this.state.getCompleteOrders}
                keyExtractor={(item) => item.id + item.name}
                renderItem={this.renderItemComplete}
                onEndReachedThreshold={0.03}
              />
            </View>
                </View>
                </View>
                {this.state.showTransparentLoader ? <TransparentLoader /> : null}
            </SafeAreaView>
        )
    }
    renderItems = ({item, index}) => {
        if (item.order_status === "1") {
            //console.log("inside render item complete oooo", item.order_status);
            // console.log(item.table_id);
            return (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 50,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp("1.6"),
                      marginTop: 5,
                    }}
                  >
                    {item.customer_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: hp("1.6"),
                      marginTop: 10,
                    }}
                  >
                    {moment(item.createdDate).fromNow()}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      backgroundColor: "black",
                      borderRadius: 5,
                      padding: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: hp("1.6"),
                      }}
                    >
                      {item.table_id != undefined && item.table_id != null
                        ? "Table " + item.table_no
                        : "À emporter"}
                    </Text>
                  </TouchableOpacity>
                  {item.payment_by_cash != undefined && item.payment_by_cash ? (
                    <Text
                      style={{
                        color: "red",
                        fontSize: hp(1.6),
                        marginTop: 5,
                      }}
                    >
                      Paiement en espèce
                    </Text>
                  ) : null}
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: "grey",
                    height: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginStart: 20,
                  }}
                ></View>
                <View style={{ flex: 1, flexWrap: "wrap" }}>
                  <ScrollView>
                    {item.cart_items.map((item, index) => {
                      return (
                        <Text
                          style={{
                            fontSize: hp("2"),
                            marginTop: index != 0 ? 5 : 0,
                            marginStart: 20,
                            color: "#0B0B0B",
                          }}
                        >
                          {item.dish_quantitiy + "x " + item.dish_id.dish_name}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    height: "100%",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <Text style={{ fontSize: hp("1"), }}>
                    À réaliser
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.toCompete(item.id);
                    }}
                    style={{
                      marginTop: 10,
                      borderRadius: 20,
                      height: hp("4"),
                      width: hp("7.1"),
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 0.5,
                      borderColor: "#BFA5F9",
                    }}
                  >
                    <Text>fini</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("ProductDetail", { data: item });
                    }}
                    style={{
                      marginTop: 10,
                      backgroundColor: "#F78985",
                      borderRadius: 5,
                      padding: 10,
                      width: wp("20"),
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: hp("1.7"),
                        //fontSize: 15,
                      }}
                    >
                      Détail
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
    }
    renderItemComplete = ({ item, index }) => {
        //console.log("OrderStaus", item.order_status);
        if (item.order_status === "3") {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 50,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: hp("1.6"),
                    marginTop: 5,
                    fontFamily: fonts.arial,
                  }}
                >
                  {item.customer_name}
                </Text>
                <Text
                  style={{
                    fontSize: hp("1.6"),
                    marginTop: 10,
                    fontFamily: fonts.arial,
                  }}
                >
                  {moment(item.createdDate).format("l")}
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    backgroundColor: "black",
                    borderRadius: 5,
                    padding: 7,
                    width: 70,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: fonts.arial_bold,
                      fontSize: hp("1.6"),
                    }}
                  >
                    {item.table_id != undefined && item.table_id != null
                      ? "Table " + item.table_no
                      : "To Go"}
                  </Text>
                </View>
                {item.payment_by_cash != undefined && item.payment_by_cash ? (
                  <Text
                    style={{
                      fontFamily: fonts.arail_italic,
                      color: "red",
                      fontSize: hp(1.6),
                      marginTop: 5,
                    }}
                  >
                    Paiement en espèce
                  </Text>
                ) : null}
              </View>
    
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "grey",
                  height: "50%",
                  marginStart: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
              <View style={{ flex: 1, flexWrap: "wrap" }}>
                <ScrollView>
                  {item.cart_items.map((item, index) => {
                    return (
                      <Text
                        style={{
                          fontSize: hp("2"),
                          marginTop: index != 0 ? 5 : 0,
                          marginStart: 20,
                          fontFamily: fonts.arial,
                          color: "#0B0B0B",
                        }}
                      >
                        {item.dish_quantitiy + "x " + item.dish_id.dish_name}
                      </Text>
                    );
                  })}
                </ScrollView>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <Text style={{ fontSize: hp("1"), fontFamily: fonts.arial }}>
                  Réalisée
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.toInCompete(item.id);
                  }}
                  style={{
                    marginTop: 10,
                    borderRadius: 20,
                    height: hp("4"),
                    width: hp("7.1"),
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.5,
                    borderColor: "#BFA5F9",
                  }}
                >
                  <Image
                    style={{ width: 32, height: 32, tintColor: "#BFA5F9" }}
                    source={require("../../../assets/correct.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ProductDetail", { data: item });
                  }}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#F78985",
                    borderRadius: 5,
                    padding: 10,
                    width: wp("20"),
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: fonts.arial_bold,
                      fontSize: hp("1.7"),
                    }}
                  >
                    Détail
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
      };
}
const mapStateToProps = state => ({
    profile: state.auth.userProfile,
    allOrders: state.auth.getorder
  });
  
  export default connect(mapStateToProps,{
      getOrders,
      toCompleteOrder
  })(withSocketContext (homeScreen));
const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    }
})