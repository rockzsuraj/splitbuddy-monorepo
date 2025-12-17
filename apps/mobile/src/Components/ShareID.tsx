import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colorTheme, darkTheme } from '../Hooks/theme';

const ShareID = ({
    id
}: { id: string }) => {

    const shareUniqueId = () => {
        Share.share({
            message: `My unique ID is: ${id}`,
        })
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={shareUniqueId}>
                <View>
                    <Text style={{ color: darkTheme.colors.background, fontWeight: '600' }}>Share</Text>
                </View>
                <View>
                    <Icon size={20} name='ios-share' color={darkTheme.colors.background} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5FCFF',
    },
    uniqueId: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: colorTheme.colors.green,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        maxWidth: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ShareID;
