import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
export default StyleSheet.create({


    container: {
      height: '100%',
      width:"100%",
      flex: 1,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"white"
     
    },
    WelcomeScreenText:{
        fontWeight:"bold",
        fontSize:20,
        color:"#F78985",marginTop:20
    },

                    loginButtonViewStyle:{
                           width:160,
                            
                            height:60,
                         
                            padding:4,alignSelf:'center',alignItems:'center',
                            justifyContent:'center',
                             backgroundColor:"#F78985"
                            },
                            registerButtonViewStyle:{
                                width:160,
                                 
                                 height:60,
                                
                                 marginLeft:30,
                                 padding:4,alignSelf:'center',alignItems:'center',
                                 justifyContent:'center',
                                 
                                 backgroundColor:"#FFFF",
                                
                                 borderWidth:2,
                                borderColor:"#F78985"}
                            
                            
  
  })