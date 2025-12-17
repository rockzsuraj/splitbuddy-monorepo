import { Avatar, Banner, Button, HStack, useBoolean, useTheme } from '@react-native-material/core';
import React, { FC, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from '../../Context/AppProvider';

interface Props {
    message: string,
}

const ErrorBanner: FC<Props> = (props) => {
    const { message } = props;
    const theme = useTheme();
    const { setErrorMessage, state: { errorMessage } } = useContext(AppContext)
    const [flag, setFlag] = useBoolean();

    const dismissError = () => {
        setErrorMessage('');
        setFlag.off()
    }
    useEffect(() => {
        let timeout: any;
        if (!!errorMessage) {
            setFlag.on();
            timeout = setTimeout(() => {
                dismissError();
            }, 10000);
        }

        return () => clearTimeout(timeout);
    }, [errorMessage])



    return (
        <>
            {
                !!flag && (
                    <Banner
                        style={{ backgroundColor: theme.palette.error.main, position: 'absolute', zIndex: 5, top: 50, left: 0, right: 0 }}
                        textStyle={{ color: theme.palette.error.on, fontWeight: 'bold' }}
                        illustration={props => (
                            <Avatar
                                color="error"
                                icon={props => <Icon name="error-outline" {...props} size={35} />}
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
                                    onPress={dismissError} />
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

export default ErrorBanner;
