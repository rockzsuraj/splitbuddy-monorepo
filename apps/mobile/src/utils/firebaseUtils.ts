// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { firebase } from '@react-native-firebase/storage';
// import { ImagePickerResponse } from 'react-native-image-picker/lib/typescript/types';
// import { userData } from '../../types';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// export const loginUser = async (email: string, password: string) => {
//   try {
//     const res = await auth()
//       .signInWithEmailAndPassword(email, password);
//     return (`Great to see you, ${auth().currentUser?.displayName}! You have successfully signed in.`);
//   } catch (error) {
//     console.log('error', error);
    
//     if (error.code === 'auth/email-already-in-use') {
//       throw new Error('That email address is already in use!');
//     }

//     if (error.code === 'auth/invalid-email') {
//       throw new Error('That email address is invalid!');
//     }
//     throw new Error(`${error.response.data.error.message}`);
//   }
// };

// export const isSignedIn = async () => {
//   try {
//     const isSignedIn = await GoogleSignin.isSignedIn();
//     return isSignedIn;
//   } catch (error) {
//     throw new Error(`${error}`);
//   }

// };

// export const googleSignOut = async () => {
//   try {
//     await GoogleSignin.signOut();
//   } catch (error) {
//     throw new Error(`${error}`);
//   }
// };

// export const logoutUser = async () => {
//   try {
//     const isGoogleSignin = await GoogleSignin.isSignedIn();
//     if (isGoogleSignin) {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//     }
//     const res = await auth()
//       .signOut();
//     return ('User signed out!');
//   } catch (error) {
//     throw new Error(error.response.data.error.message)
//   }
// };

// export async function uploadImage(userId: FirebaseAuthTypes.User, response: ImagePickerResponse) {
//   try {
//     const uri = response.assets?.[0]?.uri;
//     if (uri) {
//       const storageRef = firebase.storage().ref();
//       const response = await fetch(uri);
//       const blob = await response.blob();

//       // Define the filename for the image
//       const filename = `users/${userId.uid}/profile.jpg`;

//       // Upload the image to Firebase Storage
//       const uploadTask = storageRef.child(`profileImages/${filename}`).put(blob);
//       const url = await new Promise((resolve, reject) => {
//         uploadTask.on(
//           'state_changed',
//           (snapshot) => {
//             // Handle progress updates here
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log(`Upload is ${progress}% complete`);
//           },
//           (error) => {
//             // Handle errors here
//             console.error(error);
//             reject(error);
//           },
//           async () => {
//             // Handle successful upload here
//             try {
//               const downloadURL = await uploadTask?.snapshot?.ref?.getDownloadURL();
//               console.log(`Image uploaded to ${downloadURL}`);
//               resolve(downloadURL);
//             } catch (error) {
//               console.error(error);
//               reject(error);
//             }
//           },
//         );
//       });
//       return url;
//     }
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// }

// const updateProfile = async (name: string, avatar: string) => {
//   const currentUser = auth().currentUser;

//   try {
//     if (currentUser) {
//       await currentUser.updateProfile({
//         displayName: name,
//         photoURL: avatar
//       });
//       return ('Profile updated successfully');
//     }
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// const updateProfilePicture = async (avatar: string) => {
//   const currentUser = auth().currentUser;

//   try {
//     if (currentUser) {
//       await currentUser.updateProfile({
//         photoURL: avatar
//       });
//       return ('Profile picture updated successfully');
//     }
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// const updateProfileName = async (name: string) => {
//   const currentUser = auth().currentUser;

//   try {
//     if (currentUser) {
//       await currentUser.updateProfile({
//         displayName: name,
//       });
//       return ('Profile picture updated successfully');
//     }
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// export const registerUser = async (values: userData, image: ImagePickerResponse | null): Promise<FirebaseAuthTypes.User> => {
//   const { name, email, password } = values;

//   try {
//     const { user } = await auth().createUserWithEmailAndPassword(email, password);

//     if (image) {
//       const photoURL = await uploadImage(user, image);

//       if (photoURL && typeof photoURL === 'string') {
//         await user.updateProfile({
//           displayName: name,
//           photoURL: photoURL
//         });

//         console.log(`User profile picture and name updated: ${name} ${photoURL}`);
//       } else {
//         await user.updateProfile({
//           displayName: name
//         });

//         console.log(`User profile name updated:, ${name}`);
//       }
//     } else {
//       await user.updateProfile({
//         displayName: name
//       });
//       console.log(`User profile name updated:, ${name}`);
//     }

//     console.log(`User created:, ${user.email}`);
//     return new Promise((resolve, reject) => {
//       auth().onAuthStateChanged((user) => {
//         if (user) {
//           // Check if the user's profile has been updated
//           if (user.displayName && user.photoURL) {
//             console.log(`'User profile picture and name updated:', ${user.displayName}, ${user.photoURL}`);
//             resolve(user);
//           } else if (user.displayName) {
//             console.log(`User profile name updated:, ${user.displayName}`);
//             resolve(user);
//           } else {
//             // User's profile has not been updated yet
//             console.log("User's profile has not been updated yet")
//           }
//         } else {
//           reject(new Error('User not found'));
//         }
//       });
//     });
//   } catch (error) {
//     throw new Error(`Registration failed:, ${error.response.data.error.message}`);
//   }
// };

// // Function to add a member to a group
// export const addMemberToGroup = async (groupId: string, emailId: string) => {
//   try {
//     //getUserData
//     const user = await getUserData(emailId);
//     if (!user) {
//       throw new Error('user is not available');
//     }
//     // Get a reference to the group document
//     const groupDocRef = firestore().collection('groups').doc(groupId);
//     const uploadData = { id: user.email, name: user.name || '', photoUrl: user.photoUrl || '' };
//     // Add the member to the group
//     await groupDocRef.update({
//       members: firestore.FieldValue.arrayUnion(emailId),
//       groupMember: firestore.FieldValue.arrayUnion(uploadData),
//     });
//     return (`${user.name} is added successfully🎉`)
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// export const deleteGroup = async (groupId?: string) => {
//   try {
//     const groupDocRef = firestore().collection('groups').doc(groupId);
//     await groupDocRef.delete();
//     return ('Group deleted successfully!');
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// export const removeMember = async (groupId: string, emailId: string, memberName: string, photoUrl?: string) => {
//   try {
//     const groupDocRef = firestore().collection('groups').doc(groupId);
//     const memberDocRef = groupDocRef.collection('members').doc(emailId);

//     await memberDocRef.delete();
//     // Update the 'groupMember' array to remove the member with ID 'emailId'
//     if (!!photoUrl) {
//       await groupDocRef.update({
//         groupMember: firestore.FieldValue.arrayRemove({ id: emailId, name: memberName, photoUrl }),
//       });
//     } else {
//       await groupDocRef.update({
//         groupMember: firestore.FieldValue.arrayRemove({ id: emailId, name: memberName }),
//       });
//     }
//     await groupDocRef.update({
//       members: firestore.FieldValue.arrayRemove(emailId),
//     });

//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// export const updateUserProfile = async (photoURL?: string) => {
//   try {
//     const currentUser = auth().currentUser;
//     if (!!currentUser && !!photoURL) {
//       await currentUser.updateProfile({
//         photoURL: photoURL
//       });
//     }
//     return ('Your profile is updated!');
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// };

// export const addUserCollection = async (user: FirebaseAuthTypes.User) => {
//   // Create a new document in the "users" collection with the user's UID as the document ID
//   await firestore()
//     .collection('users')
//     .doc(user.uid)
//     .set({
//       ...user
//     });

// }
// export const createUserDocument = (user: FirebaseAuthTypes.User) => {
//   if (user && user.email) {
//     firestore()
//       .collection('users')
//       .doc(user.email)
//       .set({
//         name: user.displayName,
//         photoUrl: user.photoURL,
//         email: user.email,
//       })
//       .then(() => {
//         return ('User document created in Firestore!');
//       })
//       .catch((error) => {
//         throw new Error(`Error creating user document in Firestore: , ${error}`);
//       });
//   }
// };

// export const getUserData = async (email: string) => {
//   try {
//     if (!email) {
//       throw new Error(`User is not available!`);
//     }

//     const doc = await firestore().collection('users').doc(email).get();
//     if (doc.exists) {
//       const user = doc.data();
//       return user;
//     } else {
//       throw new Error(`User data not found!`);
//     }
//   } catch (error) {
//     // Handle error
//     throw new Error(error.response.data.error.message);
//   }
// }


// export const verifyUserAndGetDetails = (email: string) => {
//   auth().fetchSignInMethodsForEmail(email)
//     .then((signInMethods) => {
//       const isUserAvailable = signInMethods.length > 0;

//       if (isUserAvailable) {
//         firestore()
//           .collection('users')
//           .doc(email)
//           .get()
//           .then((doc) => {
//             if (doc.exists) {
//               const user = doc.data();
//               const photoUrl = user?.photoUrl;
//               const name = user?.name;
//               return ({ photoUrl, name });
//             } else {
//               // User data not found
//             }
//           })
//           .catch((error) => {
//             // Handle error
//             throw new Error(error.response.data.error.message);
//           });
//       } else {
//         throw new Error(`User is not available!`)
//       }
//     })
//     .catch((error) => {
//       throw new Error(error.response.data.error.message);
//     });
// }

// export const handleDeleteAccount = async () => {
//   try {
//     const user = auth().currentUser;
//     if (user) {
//       const googleSignedIn = await GoogleSignin.isSignedIn();
//       if (googleSignedIn) {
//         await GoogleSignin.revokeAccess();
//       }
//       await user.delete();
//       return 'Account deleted successfully.';
//     } else {
//       throw new Error('Something went wrong!')
//     }
//   } catch (error) {
//     throw new Error(`Error ${error.response.data.error.message}`);
//   }
// };

// export const handleUserImageUpdate = async (downloadURL: string, user: FirebaseAuthTypes.User) => {
//   // Update the user document in Firestore with the new profile picture URL
//   try {
//     if (downloadURL && user && user.email !== null) {
//       const userRef = firestore().collection('users').doc(user.email);
//       await userRef.update({ photoUrl: downloadURL });
//       return (`Success, Profile picture updated successfully.`);
//     } else {
//       throw new Error('Something went wrong pls try again after sometimes!')
//     }
//   } catch (error) {
//     throw new Error(error.response.data.error.message);
//   }
// }

// export const updatePassword = (oldPassword: string, newPassword: string) => {
//   const user = firebase.auth().currentUser;

//   if (user && user.email) {
//     const credential = firebase.auth.EmailAuthProvider.credential(
//       user.email,
//       oldPassword
//     );

//     user.reauthenticateWithCredential(credential)
//       .then(() => {
//         user.updatePassword(newPassword)
//           .then(() => {
//             return ('Password updated successfully');
//           })
//           .catch((error) => {
//             throw new Error(error);
//           });
//       })
//       .catch((error) => {
//         throw new Error(error);
//       });
//   } else {
//     throw new Error('User not found!')
//   }

// }
// export const deleteUserDocument = async (user: FirebaseAuthTypes.User) => {
//   const res = await new Promise((resolve, reject) => {
//     if (user && user.email) {
//       firestore()
//         .collection('users')
//         .doc(user?.email)
//         .delete()
//         .then(() => {
//           resolve('User deleted successfully!');
//         })
//         .catch((error) => {
//           reject(`Error deleting user document from Firestore: ${error}`);
//         });
//     } else {
//       reject(`User not found!`);
//     }
//   })
// };

// export const deleteUserGroups = async (user: FirebaseAuthTypes.User) => {
//   if (user && user.email) {
//     const groupsRef = firebase.firestore().collection('groups');
//     const query = groupsRef.where('members', 'array-contains', user.email);
//     query.get().then(querySnapshot => {
//       // Iterate through the query snapshot to get the documents.
//       querySnapshot.forEach(docSnapshot => {
//         const group = docSnapshot.data();
//         const groupId = docSnapshot.id;

//         // Delete the group if the user is the only member.
//         if (group.members.length === 1) {
//           groupsRef.doc(groupId).delete().then(() => {
//             console.log(`Group ${groupId} deleted successfully.`);
//           }).catch(error => {
//             throw new Error(`Error deleting group ${groupId}: ${error}`);
//           });
//         }
//       });
//     }).catch(error => {
//       throw new Error(`Error getting groups: ${error}`);
//     });
//   } else {
//     return "User not available";
//   }
// }

// export async function deleteProfileImage(user: FirebaseAuthTypes.User) {
//   try {
//     const filename = `profileImages/users/${user.uid}`;
//     const imagePath = `${filename}/profile.jpg`;
//     const reference = firebase.storage().ref(imagePath);
//     // Get the metadata of the file
//     const metadata = await reference.getMetadata();
//     if (metadata.size) {
//       // Delete the file
//       await reference.delete();
//       console.log('Image deleted successfully.');
//     } else {
//       console.log('Image does not exist.');
//     }
//   } catch (error) {
//     throw new Error(`Error deleting profile image:, ${error}`);
//   }
// }



// export default {
//   registerUser,
//   loginUser,
//   logoutUser,
//   uploadImage,
//   addMemberToGroup,
//   deleteGroup,
//   removeMember,
//   addUserCollection,
//   createUserDocument,
//   handleDeleteAccount,
//   handleUserImageUpdate,
//   updatePassword,
//   deleteUserDocument,
//   deleteUserGroups,
//   deleteProfileImage,
// };
