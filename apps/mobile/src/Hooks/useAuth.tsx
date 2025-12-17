import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

interface UpdateProfileFormData {
    displayName: string;
    photoURL: string;
}

interface UpdatePasswordFormData {
    password: string;
    newPassword: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    console.log('user, +>', user);


    useEffect(() => {
        // const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
        //     if (firebaseUser) {
        //         const { uid, displayName, email, photoURL } = firebaseUser;
        //         setUser({ uid, displayName, email, photoURL });
        //     } else {
        //         setUser(null);
        //     }
        //     setLoading(false);
        // });

        // return unsubscribe;
    }, []);

    const updateProfile = async (formData: UpdateProfileFormData) => {
        try {
            // const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;

            // if (!currentUser) {
            //     throw new Error('User not found');
            // }

            // // Update display name
            // if (formData.displayName !== currentUser.displayName) {
            //     await currentUser.updateProfile({
            //         displayName: formData.displayName,
            //     });
            //     // setUser({ ...user, displayName: formData.displayName });
            // }

            // // Update profile image
            // if (formData.photoURL !== currentUser.photoURL) {
            //     await currentUser.updateProfile({
            //         photoURL: formData.photoURL,
            //     });
            //     // setUser({ ...user, photoURL: formData.photoURL });
            // }
        } catch (error) {
            throw error;
        }
    };

    const updatePassword = async (formData: UpdatePasswordFormData) => {
        // try {
            // const currentUser: FirebaseAuthTypes.User | null = auth().currentUser;

        //     if (!currentUser) {
        //         throw new Error('User not found');
        //     }

        //     const credential = auth.EmailAuthProvider.credential(
        //         currentUser.email!,
        //         formData.password,
        //     );
        //     await currentUser.reauthenticateWithCredential(credential);
        //     await currentUser.updatePassword(formData.newPassword);
        // } catch (error) {
        //     throw error;
        // }
    };

    const updateUser = (user: User) => {
        setUser(user);
    }

    const updateUserFormik = useFormik({
        initialValues: {
            displayName: user?.displayName || '',
            photoURL: user?.photoURL || '',
            password: '',
            newPassword: '',
        },
        validationSchema: Yup.object().shape({
            displayName: Yup.string().required('Display name is required'),
            photoURL: Yup.string().url('Profile image must be a valid URL'),
            password: Yup.string().required('Password is required'),
            newPassword: Yup.string()
                .required('New password is required')
                .min(6, 'New password must be at least 6 characters'),
        }),
        onSubmit: async (formData) => {
            try {
                await updateProfile(formData);
                await updatePassword(formData);
            } catch (error) {
                throw new error.response.data.error.message;
            }
        },
    });

    return { user, loading, updateProfile, updatePassword, updateUserFormik, updateUser };
};

export default useAuth;
