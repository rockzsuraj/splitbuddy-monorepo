import { Button, Snackbar, useTheme } from "@react-native-material/core";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppProvider";

const ErrorSnackBar = ({ message }: { message: string }) => {
    const { state: { successMessage, errorMessage }, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const theme = useTheme();
    const onDismiss = () => {
        setErrorMessage('');
    }
    const dismissError = () => {
        setErrorMessage('');
    }
    useEffect(() => {
        let timeout: any;
        if (!!errorMessage) {
            timeout = setTimeout(() => {
                dismissError();
            }, 5000);
        }

        return () => clearTimeout(timeout);
    }, [errorMessage])
    return (
        < >
            {!!errorMessage && (
                <Snackbar
                    message={errorMessage}
                    action={
                        <Button
                            variant="text"
                            title="Dismiss"
                            color="white"
                            compact onPress={onDismiss}
                        />}
                    style={
                        {
                            position: "absolute",
                            start: 16,
                            end: 16,
                            top: 50,
                            backgroundColor: theme.palette.error.main,
                            zIndex: 5
                        }}

                />)}
        </>
    );
}

export default ErrorSnackBar;