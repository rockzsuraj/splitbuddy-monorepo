import { Avatar, Banner, Button, HStack, useBoolean, useTheme } from '@react-native-material/core';
import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AppContext } from '../../Context/AppProvider';

interface Props {
    message?: string,

}

const WelcomeBanner: FC<Props> = (props) => {
    const { message } = props;
    const theme = useTheme();
    const { setWelcomeMessage, state: { welcomeMessage } } = useContext(AppContext)
    const [flag, setFlag] = useBoolean();

    const dismissWelcomeMessage = () => {
        setWelcomeMessage('');
        setFlag.off()
    }
    useEffect(() => {
        // if (welcomeMessage) {
        //     setFlag.on();
        // }

    }, [welcomeMessage])


    return (
        <>
            {
                !!flag && (
                    <Banner
                        style={{ backgroundColor: '#ff9a55', position: 'absolute', zIndex: 1, top: 50, left: 0, right: 0 }}
                        textStyle={{ color: theme.palette.error.on, fontWeight: 'bold' }}
                        illustration={props => (
                            <Avatar
                                color="#e7b2ff"
                                icon={props => <Icon name="robot-happy-outline" {...props} size={35} />}
                                {...props}
                            />
                        )}
                        text={welcomeMessage}
                        buttons={
                            <HStack spacing={2}>
                                <Button
                                    key="Dismiss"
                                    variant="text"
                                    title="Dismiss"
                                    compact
                                    color={theme.palette.error.on}
                                    onPress={dismissWelcomeMessage} />
                            </HStack>
                        }
                    />
                )
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    banner: {
        // flex: 1,
    },
});

export default WelcomeBanner;
