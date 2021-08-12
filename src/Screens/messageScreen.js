import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { LOGIN_SUCCESS } from '../Redux/AuthReducers'

class messageScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        // console.log('value check',this.props.profile)
    }
    render() {
        console.log('value check',this.props.profile)

        return (
            <Text style={styles.container}>
                Message Screen
            </Text>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    }
})
const mapStateToProps = state => ({
    profile: state.auth.userProfile

})
export default connect( mapStateToProps)(
    messageScreen
)