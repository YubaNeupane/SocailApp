import { View, TextInput, StyleSheet, Keyboard,  TouchableWithoutFeedback } from 'react-native';
import React from 'react'

export default DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback 
        onPress={() => Keyboard.dismiss()}> {children}
    </TouchableWithoutFeedback>
);
