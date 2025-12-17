import React from 'react';
import { TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colorTheme } from '../Hooks/theme';

interface Props {
    onPress: () => void;
    size?: number;
    color?: string;
}

const CloseButton: React.FC<Props> = ({ onPress, size = 24, color = colorTheme.colors.tomato }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ position: 'absolute', top: 18, right: 20, zIndex: 10 }}>
            <AntDesign name="closecircle" size={size} color={color} />
        </TouchableOpacity>
    );
};

export default CloseButton;
