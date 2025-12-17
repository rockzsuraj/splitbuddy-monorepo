import { Avatar, Banner, Button, HStack, useBoolean, useTheme } from '@react-native-material/core';
import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from '../../Context/AppProvider';

interface Props {
    message: string,

}

const SuccessBanner: FC<Props> = (props) => {
    const { message } = props;
    const theme = useTheme();
    const { setSuccessMessage, state: { successMessage } } = useContext(AppContext)
    const [flag, setFlag] = useBoolean();

    const dismissSuccessMessage = () => {
        setSuccessMessage('');
        setFlag.off()
    }
    useEffect(() => {
        // let timeout: any;
        // if (!!successMessage) {
        //     setFlag.on();
        //     timeout = setTimeout(() => {
        //         dismissSuccessMessage()
        //     }, 10000);
        // }

        // return () => clearTimeout(timeout);
    }, [successMessage])

    return (
        <>
            {
                !!flag && (
                    <Banner
                        style={{ backgroundColor: '#009944', position: 'absolute', zIndex: 1, top: 50, left: 0, right: 0 }}
                        textStyle={{ color: theme.palette.error.on, fontWeight: 'bold' }}
                        illustration={props => (
                            <Avatar
                                color="#009944"
                                icon={props => <Icon name="check-circle-outline" {...props} size={35} />}
                                {...props}
                            />
                        )}
                        text={message}
                        buttons={
                            <HStack spacing={2}>
                                <Button
                                    key="Dismiss"
                                    variant="text"
                                    title="Dismiss"
                                    compact
                                    color={theme.palette.error.on}
                                    onPress={dismissSuccessMessage} />
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

export default SuccessBanner;
