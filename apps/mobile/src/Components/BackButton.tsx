import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../Hooks/theme';

interface Props {
    onPress?: () => void;
    size?: number;
    color?: string;
}

const BackButton: React.FC<Props> = ({ onPress, size = 30, color }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const activeColor = color ? color : theme.colors.text;
    const handleBack = () => {
        if (onPress) {
            onPress
        } else {
            navigation.goBack()
        }
    }
    return (
        <TouchableOpacity
            onPress={handleBack}
            style={{}}
        >
            <Icon name="chevron-left" size={size} color={activeColor} />
        </TouchableOpacity>
    );
};

export default BackButton;
