import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import UserPermissions from "../utilities/UserPermissions";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';    



const firebase = require("firebase");
require("firebase/firestore");

export default class PostScreen extends React.Component {
    state = {
        text: "",
        image: null,
        avatar: null,
        disablePost:false
    };

    unsubscribe = null;

    componentDidMount() {
       UserPermissions.getCamaraPermission()

       const user = this.props.uid || Fire.shared.uid;

        this.unsubscribe = Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                this.setState({ avatar: doc.data().avatar });
            });


    }



    componentWillUnmount() {
        this.unsubscribe();
    }

    compressImage = async (uri, format = SaveFormat.JPEG) => { // SaveFormat.PNG
        const result = await manipulateAsync(
            uri,
            [{ resize: { width: 500 } }],
            { compress: 0.1, format }
        );
    
        this.setState({ image: result.uri });
       // console.log({ name: `${Date.now()}.${format}`, type: `image/${format}`, ...result })
       // return  { name: `${Date.now()}.${format}`, type: `image/${format}`, ...result };
        // return: { name, type, width, height, uri }
    };



    handlePost = () => {
        this.setState({disablePost:true})

        Fire.shared
            .addPost({ text: this.state.text.trim(), localUri: this.state.image })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.goBack();
                this.setState({disablePost:false})
            })
            .catch(error => {
                alert(error);
                this.setState({disablePost:false})
            });
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect:[4,3],
            quality: 8,
            exif: false
        })



        if (!result.cancelled) {
           
            this.compressImage(result.uri)
           // console.log(result)
            
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost} disabled={this.state.disablePost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={
                                this.state.avatar
                                    ? { uri: this.state.avatar }
                                    : require("../assets/tempAvatar.jpg")
                            } style={styles.avatar}></Image>
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
        flexDirection: "row"
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
});
