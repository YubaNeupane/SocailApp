import React from "react";
import { View, Text, StyleSheet,FlatList,Image,StatusBar} from "react-native";
import * as firebase from "firebase";
import {Ionicons} from '@expo/vector-icons'
import moment from 'moment'
import Fire from '../Fire'
require("firebase/firestore");



// temporary data until we pull from Firebase
// posts = [
//     {
//         id: "1",
//         name: "Joe McKay",
//         text:
//             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//         timestamp: 3216565351,
//         avatar: require('./../assets/tempAvatar.jpg'),
//         image: require("../assets/icon.png")
//     },
//     {
//         id: "2",
//         name: "Karyn Kim",
//         text:
//             "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//         timestamp: 1569109273726,
//         avatar: require('./../assets/tempAvatar.jpg'),
//         image: require("../assets/icon.png")
//     },
//     {
//         id: "3",
//         name: "Emerson Parsons",
//         text:
//             "Amet mattis vulputate enim nulla aliquet porttitor lacus luctus. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant.",
//         timestamp: 1569109273726,
//         avatar: require('./../assets/tempAvatar.jpg'),
//         image: require("../assets/icon.png")
//     },
//     {
//         id: "4",
//         name: "Kathie Malone",
//         text:
//             "At varius vel pharetra vel turpis nunc eget lorem. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. Adipiscing tristique risus nec feugiat in fermentum.",
//         timestamp: 1569109273726,
//         avatar: require('./../assets/tempAvatar.jpg'),
//         image: require("../assets/loginLogo.png")
//     }
// ];

export default class HomeScreen extends React.Component {
    state={
        posts:[],
        users:[]
    }

    
    getUser = async() =>{
        const observer = firebase.firestore().collection('users')
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    console.log(change.doc.data())
                }
            });
        });
    }

    getData = async() =>{
        const observer = firebase.firestore().collection('posts')
        .onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const temp = [...this.state.posts]
                const updatedPosts = [...temp,change.doc.data()]
                const updatedSortedPosts = updatedPosts.sort((a, b) => b.timestamp - a.timestamp)
                this.setState({posts:updatedSortedPosts})
            }
            if (change.type === 'modified') {
                // console.log('Modified city: ', change.doc.data());
            }
            if (change.type === 'removed') {
                // let updatedPosts = []
                // updatedPosts = [...updatedPosts,change.doc.data()]
                // const updatedSortedPosts = updatedPosts.sort((a, b) => b.timestamp - a.timestamp)
                // this.setState({posts:updatedSortedPosts})
            }
            });
        });
    }

    componentDidMount(){
        this.getData()
        this.getUser()
    }


    renderPost = post =>{
      //  console.log(post.image)
        return(
            <View style={styles.feedItem}>
                <Image source={post.avatar} style={styles.avatar}/>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View>
                            <Text style={styles.name}>{post.name}</Text>
                            <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                        </View>
                        <Ionicons name='ios-more' size={24} color='#73788B'style={{marginRight:15}}/>

                    </View>
                    <Text style={styles.post}>{post.text}</Text>
                    {post.image ? <Image source={ {uri: post.image} } style={styles.postImage} resizeMode='cover'/> :null}
                    

                    <View style={{flexDirection:'row'}}>
                        <Ionicons name='ios-heart-empty' size={24} color='#73788B' style = {{marginRight:16}}/>
                        <Ionicons name='ios-chatboxes' size={24} color='#73788B'/>
                    </View>

                </View>

            </View>
        )
    }
    



    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content"></StatusBar>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                </View>
                
                <FlatList 
                    style={styles.feed} 
                    data={this.state.posts} 
                    renderItem={({item})=>this.renderPost(item)} 
                    keyExtractor={item=>item.id}
                    showsVerticalScrollIndicator={false}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#EFECF4'
    },
    header:{
        paddingTop:64,
        paddingBottom:16,
        backgroundColor:'#FFF',
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'#EBECF4',
        shadowColor:'#454D65',
        shadowOffset:{height:5},
        shadowRadius:15,
        shadowOpacity:0.2,
        zIndex:10
    },
    headerTitle:{
        fontSize:25,
        fontWeight:"600"
    },
    feed:{
        marginHorizontal:16,
    },
    feedItem:{
        backgroundColor:"#FFF",
        borderRadius:10,
        padding:8,
        flexDirection:'row',
        marginVertical:8,
    },
    avatar:{
        width:36,
        height:36,
        borderRadius:18,
        marginRight:16,
    },
    name:{
        fontSize:15,
        fontWeight:'600',
        color:'#454D65',

    },
    timestamp:{
        fontSize:11,
        color:'#C4C6CE',
        marginTop:4
    },
    post:{
        marginTop:16,
        fontSize:14,
        color:'#838899'
    },
    postImage:{
        width:undefined,
        height:150,
        borderRadius:5,
        marginVertical:16,
    }
}); 
