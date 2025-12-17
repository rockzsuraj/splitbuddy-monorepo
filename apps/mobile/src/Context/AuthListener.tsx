import { useContext, useEffect } from 'react';
import { AppContext } from './AppProvider';
import { AppState } from 'react-native';
import { getCurrentUser } from '../api/services/authservice';

function AuthListener() {
    const { setUser, setAppInit, setLoading, setErrorMessage } = useContext(AppContext);

    useEffect(() => {
        // 1. Run auto-login immediately on mount
        setLoading(true);
        setAppInit(true);
        const handleAutoLogin = async () => {
            try {
                const user = await getCurrentUser();
                setUser(user);
            } catch (error: any) {
                setErrorMessage(error?.response?.data?.error?.message)
            } finally {
                setLoading(false);
                setAppInit(false);
            }
        };
        handleAutoLogin().catch(e => console.log('error auto logon', e));

        // 2. Listen for app resuming from background → re-check tokens
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                console.log('active');
                setLoading(true);
                setAppInit(true);
                handleAutoLogin()
                    .catch(e => console.log('AutoLogin error:', e));
            }
        });
        return () => subscription.remove();
    }, []);

    return null;
}

export default AuthListener;
