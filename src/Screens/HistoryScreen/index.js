import React, { Component } from 'react'
import { 
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView,} from 'react-native'

import {fonts} from "../../Helper/Fonts"
import NoDataText from "../../Config/NoDataText"
import { connect } from 'react-redux'
import { EventRegister } from "react-native-event-listeners";
import moment from "moment";
import { getPastOrders } from '../../Redux/Reducers/OrdersHistory/ordersHistoryActions'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import Loader from "../../Config/FullScreenLoader"
class ordersHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
          listen: "",
          data: [],
          showNoDataInput: false,
          isLoading: true,
        };
      }
      componentDidMount = async () => {
          await this.getAllCompleteOrders();
      }
      getAllCompleteOrders = async () => {
        const restaurant = await this.props.profile.id;
        const token = await this.props.profile.token
        try {
            this.props.getPastOrders(restaurant, token, (res) => {
                this.setState({
                    data: res.orderDetail,
                  });
                  if (res.orderDetail != undefined && res.orderDetail.length == 0) {
                    this.setState({ showNoDataInput: true });
                  } else this.setState({ showNoDataInput: false });
                  // console.log(res.orderDetail[0].cart_id.dish_id)
                  this.setState({ isLoading: false });
            })
        } catch (error) {
            console.log(error);
            this.setState({ isLoading: false });
            alert("Something went wrong.");
        }
      };
      componentWillMount() {
        this.listener = EventRegister.addEventListener("myRejectEvent", (data) => {
          this.setState({
            listen: data,
          });
          this.getAllCompleteOrders();
        });
      }
    render() {
        if (this.state.isLoading) return <Loader />;
        return (
            <SafeAreaView style={{ backgroundColor: "white" }}>
                <View
                style={{
                    height: "100%",
                    padding: 10,
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                    <View>
                        <Text style={{ fontFamily: fonts.arial_bold, fontSize: hp("2.3") }}>
                            History
                        </Text>
                    </View>
                    <View style={{ flexDirection: "column", width: "100%" }}>
                    {this.state.showNoDataInput ? (
              <NoDataText text={"No Orders Found"} />
            ) : null}
            <FlatList 
            data={this.state.data}
            keyExtractor={(item) => item.id + item.name}
            renderItem={this.renderItem}
            onEndReachedThreshold={0.03}
            />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
    renderItem = ({item, index}) => {
        if (
            item.order_status === undefined ||
            item.order_status == 0 ||
            item.order_status == 1
          )
            return null;
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
                      {moment(item.createdDate).fromNow()}
                    </Text>
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
                  <View style={{ flexDirection: "row", flex: 1, marginStart: 15 }}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: "grey",
                        height: "50%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <View style={{ flexWrap: "wrap" }}>
                        <ScrollView>
                          {item.cart_items.map((item, index) => {
                            return (
                              <Text
                                style={{
                                  fontSize: hp("2"),
                                  marginTop: index != 0 ? 5 : 0,
                                  marginStart: 10,
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
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 30,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        marginTop: 5,
                        backgroundColor: "#F78985",
                        borderRadius: 5,
                        padding: 10,
                        width: wp("20"),
                        alignItems: "center",
                      }}
                      onPress={() => {
                        this.props.navigation.navigate("ProductDetail", { data: item });
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
}
const mapStateToProps = state => ({
    profile: state.auth.userProfile
  });
  
  export default connect(mapStateToProps, {
    getPastOrders
  })(ordersHistory);
const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    }
})