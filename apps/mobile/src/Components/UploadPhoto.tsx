import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import { ImageLibraryOptions, launchImageLibrary, launchCamera } from 'react-native-image-picker';

const UploadPhoto = () => {
    const [image, setImage] = useState(null);

    const handleLaunchImageLibrary = async () => {
        console.log('launch Image Libraray');

        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        }
        await launchImageLibrary(options, (response) => {
            if (response.uri) {
                setImage(response);
            }
        });
    };

    return (
        <View>
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
            <Button title="Select Photo" onPress={handleLaunchImageLibrary} />
        </View>
    );
};

export default UploadPhoto;
