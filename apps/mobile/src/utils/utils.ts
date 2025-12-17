import { refreshAccessToken } from '../api/services/authservice';
import { getTokens } from '../lib/storage';
import { jwtDecode } from 'jwt-decode';
import { launchImageLibrary } from "react-native-image-picker";
import { ImageLibraryOptions } from "react-native-image-picker/lib/typescript/types";
import { Balance } from '../../types/group';

export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}

// Handle user state changes
export async function initializeAuth() {
    const { accessToken, refreshToken } = await getTokens();

    if (!accessToken || !refreshToken) {
        return { loggedIn: false };
    }
    if (!isTokenExpired(accessToken)) {
        return { loggedIn: true, token: accessToken };
    }
    if (!isTokenExpired(refreshToken)) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        return { loggedIn: true, token: newAccessToken };
    }
    return { loggedIn: false };
}

export const handleChoosePhoto = async () => {
    console.log('User click handleChoosePhoto');
    try {
        // TODO: implement image picker
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxHeight: 200,
            maxWidth: 200
        }
        const result = await launchImageLibrary(options);
        return result;
    } catch (error: any) {
        console.log(error.response.data.error.message);

    }
};

/**
 * Logs error details in a consistent manner.
 * Extracts meaningful info (status, message) if available.
 * @param error - The error object caught
 * @param context - Optional additional context or label to log
 */
export const logError = (error: any, context?: string) => {
  // Prioritize backend error structure, then Axios response, then generic error
  let message = error?.error?.message ||                    // Backend: error.message
                error?.response?.data?.error?.message ||     // Nested backend in Axios response
                error?.response?.data?.message ||             // Direct message in Axios response
                error?.message ||                             // Generic JS error
                JSON.stringify(error);                         // Fallback

  // Extract status from multiple possible locations
  const status = error?.response?.status || 
                 error?.status || 
                 error?.error?.code || 
                 null;

  const formattedStatus = status ? ` (status ${status})` : '';

  if (context) {
    console.error(`[${context}] Error${formattedStatus}: ${message}`);
  } else {
    console.error(`Error${formattedStatus}: ${message}`);
  }
  console.log('ERROR', JSON.stringify(error.toJSON?.() ?? error, null, 2));
};



export const calculateYouOweOwed = (balances: Balance[], currentUserId: number) => {
    console.log('balances calculated', balances);
    
    const myBalance = balances?.find(b => b.id === currentUserId)?.balance;
    
    let youOwe = 0;
    let youAreOwed = 0;
    
    if (myBalance && Number(myBalance) < 0) {
      youOwe = Math.abs(parseFloat(myBalance));  // e.g. user 5: 610
    } else if (myBalance && Number(myBalance) > 0) {
      youAreOwed = parseFloat(myBalance);        // e.g. user 10: 590
    }
    return { youOwe, youAreOwed };
  };
  
  export const getPairKey = (fromId: number, toId: number) =>
    `${fromId}-${toId}`;
