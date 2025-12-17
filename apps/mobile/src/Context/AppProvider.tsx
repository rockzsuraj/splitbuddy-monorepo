import React, { createContext, ReactNode, useEffect, useReducer } from 'react';
import { Appearance } from 'react-native';
import { User } from '../types/User';

type Theme = 'light' | 'dark';

interface State {
    successMessage: string;
    errorMessage: string;
    user: User | null;
    isAppInit: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    welcomeMessage: string;
    theme: Theme;
}

type Action =
    | { type: 'SET_SUCCESS_MESSAGE'; payload: string }
    | { type: 'SET_ERROR_MESSAGE'; payload: string }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_APP_INIT'; payload: boolean }
    | {
        type: 'SET_AUTH_STATE'; payload: {
            isAuthenticated: boolean; user: User | null
        }
    }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_WELCOME_MESSAGE'; payload: string }
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'TOGGLE_THEME' };

interface Context {
    state: State;
    setSuccessMessage: (message: string) => void;
    setErrorMessage: (message: string) => void;
    setUser: (user: User | null) => void;
    setAppInit: (isInit: boolean) => void;
    setLoading: (loading: boolean) => void;
    setWelcomeMessage: (message: string) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const systemScheme = Appearance.getColorScheme(); // 'light' | 'dark' | null

const initialState: State = {
    successMessage: '',
    errorMessage: '',
    user: null,
    isAppInit: false,
    isAuthenticated: false,
    loading: false,
    welcomeMessage: '',
    theme: systemScheme === 'dark' ? 'dark' : 'light', // 🔹 start with system theme
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_SUCCESS_MESSAGE':
            return { ...state, successMessage: action.payload };
        case 'SET_ERROR_MESSAGE':
            return { ...state, errorMessage: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_APP_INIT':
            return { ...state, isAppInit: action.payload };
        case 'SET_AUTH_STATE':
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user,
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_WELCOME_MESSAGE':
            return { ...state, welcomeMessage: action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
}

export const AppContext = createContext<Context>({
    state: initialState,
    setSuccessMessage: () => { },
    setErrorMessage: () => { },
    setUser: () => { },
    setAppInit: () => { },
    setLoading: () => { },
    setWelcomeMessage: () => { },
    setTheme: () => { },
    toggleTheme: () => { },
});

interface Props {
    children: ReactNode;
}

export function AppProvider({ children }: Props) {
    const [state, dispatch] = useReducer(reducer, initialState);

    function setSuccessMessage(message: string) {
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
    }

    function setErrorMessage(message: string) {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: message });
    }

    function setUser(user: User | null) {
        dispatch({ type: 'SET_USER', payload: user });
    }

    function setAppInit(isInit: boolean) {
        dispatch({ type: 'SET_APP_INIT', payload: isInit });
    }

    function setLoading(loading: boolean) {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }

    function setWelcomeMessage(message: string) {
        dispatch({ type: 'SET_WELCOME_MESSAGE', payload: message });
    }

    function setTheme(theme: Theme) {
        dispatch({ type: 'SET_THEME', payload: theme });
    }

    function toggleTheme() {
        dispatch({ type: 'TOGGLE_THEME' });
    }

    // 🔥 Auto-update theme when system theme changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorScheme === 'dark' || colorScheme === 'light') {
                dispatch({ type: 'SET_THEME', payload: colorScheme });
            }
        });

        return () => subscription.remove();
    }, []);

    return (
        <AppContext.Provider
            value={{
                state,
                setSuccessMessage,
                setErrorMessage,
                setUser,
                setAppInit,
                setLoading,
                setWelcomeMessage,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
