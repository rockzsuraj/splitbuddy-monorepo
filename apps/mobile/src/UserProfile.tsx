import { Button } from '@react-native-material/core';
import React, { useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ImagePickerResponse } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DefaultProfile from './Components/DefaultProfile';
import ScreenContainer from './Components/ScreenContainer';
import ShareID from './Components/ShareID';
import { AppContext } from './Context/AppProvider';
import { colorTheme } from './Hooks/theme';
// import { logoutUser, updateUserProfile, uploadImage } from './utils/firebaseUtils';
import { handleChoosePhoto } from './utils/utils';

const UserProfile = () => {

  const { state: { user } } = useContext(AppContext);
  const [image, setImage] = useState<ImagePickerResponse | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>();
  const { state, setErrorMessage, setSuccessMessage } = useContext(AppContext);

  const signOut = async () => {
    // try {
    //   const res = await logoutUser()
    //   if (!!res) {
    //     setSuccessMessage(`You are successfully signed out!`);
    //   }
    // } catch (error) {
    //   setErrorMessage(error.response.data.error.message)
    // }
  }

  const handleOpenPhoto = async () => {
    try {
      const result = await handleChoosePhoto();
      if (result) {
        setImage(result);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    // if (user?.photoURL) {
    //   setProfilePictureUrl(user?.photoURL);
    // }
  }, [user]);

  useEffect(() => {

    if (user?.uid && image) {
      const updateUserImage = async () => {
        // try {
        //   const url = await uploadImage(user, image);
        //   if (typeof url === 'string') {
        //     await updateUserProfile(url);
        //     setProfilePictureUrl(url);
        //   }
        // } catch (error) {
        //   console.log(error.response.data.error.message);

        // }
      }
      // updateUserImage();
    }
  }, [image?.assets?.[0]?.uri]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',
      // justifyContent: 'center'
    },
    image: {
      // width: 100,
      // height: 100,
      // borderRadius: 50,
      // marginBottom: 20
    },
    name: {
      fontSize: 24,
      color: colorTheme.colors.purple
    },
    email: {
      fontSize: 20,
      color: colorTheme.colors.purple,
    },
    uniqueId: {
      fontSize: 20,
      color: colorTheme.colors.purple,
    },
    fontStyle: {
      fontFamily: Platform.select({
        ios: 'ChokoMilky',
        android: 'ChokoMilky-gx8gR'
      })
    },
    space: {
      paddingTop: 30
    }
  });

  return (
    <ScreenContainer style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenPhoto}
      >
        <View style={{ alignSelf: 'center', width: 150, height: 150 }}>
          <DefaultProfile uri={profilePictureUrl || ''} />
        </View>
      </TouchableOpacity>
      <View style={{ paddingTop: 30 }}>
        <Text style={[styles.name, { color: colorTheme.colors.tomato }, styles.fontStyle]}>Username:</Text>
        <Text style={[styles.name]}>{user?.displayName}</Text>
      </View>
      <View style={styles.space}>
        <Text style={[styles.email, { color: colorTheme.colors.tomato, }, styles.fontStyle]}>Email id:</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={{ justifyContent: 'space-between', paddingTop: 30 }}>
        <View>
          <Text>
            <Text style={[styles.uniqueId, { color: colorTheme.colors.tomato }, styles.fontStyle]}>Unique ID:</Text>
          </Text>
          <Text style={styles.uniqueId}>{user?.uid}</Text>
        </View>
        <View style={{ paddingTop: 20 }}>
          <ShareID id={user?.uid || ''} />
        </View>
      </View>

      <Button
        title="Sign Out"
        onPress={signOut}
        titleStyle={{ color: colorTheme.colors.orangeWhite }}
        style={{ marginTop: 20, backgroundColor: colorTheme.colors.tomato }}
        leading={props => <Icon name='logout' size={20} color={colorTheme.colors.orangeWhite} />}
      />
    </ScreenContainer>
  );
}

export default UserProfile;
