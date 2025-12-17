import { Button, Snackbar } from "@react-native-material/core";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppProvider";

const SuccessSnackBar = ({ message }: { message: string }) => {
    const { state: { successMessage, errorMessage }, setErrorMessage, setSuccessMessage } = useContext(AppContext);
    const onDismiss = () => {
        setSuccessMessage('')
    }

    const dismissSuccess = () => {
        setSuccessMessage('');
    }
    useEffect(() => {
        let timeout: any;
        if (!!successMessage) {
            timeout = setTimeout(() => {
                dismissSuccess();
            }, 5000);
        }

        return () => clearTimeout(timeout);
    }, [successMessage])
    return (
        < >{
            !!successMessage && (
                <Snackbar
                    message={successMessage}
                    action={
                        <Button
                            variant="text"
                            title="Dismiss"
                            color="white"
                            compact onPress={onDismiss}
                        />}
                    style={{
                        position: "absolute",
                        start: 16,
                        end: 16,
                        top: 50,
                        backgroundColor: '#009944',
                        zIndex: 5
                    }}
                />)
        }
        </>
    );
}

export default SuccessSnackBar;