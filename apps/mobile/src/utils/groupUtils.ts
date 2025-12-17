// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   doc,
//   setDoc,
//   getDoc
// } from "firebase/firestore";
// import { getDownloadURL } from "firebase/storage";
// import { getAuth, onAuthStateChanged } from "firebase/auth";


// Function to create a new group
// async function createGroup(name, description, imageFile) {
  // // Create a new document in the "groups" collection
  // const newGroupRef = await addDoc(collection(db, "groups"), {
  //   name,
  //   description,
  // });

  // // Upload the image file to Firebase Storage
  // const imageRef = ref(storage, `groupImages/${newGroupRef.id}`);
  // await uploadBytes(imageRef, imageFile);

  // // Get the download URL for the image
  // const imageUrl = await getDownloadURL(imageRef);

  // // Update the group document with the image URL
  // await setDoc(doc(db, "groups", newGroupRef.id), { imageUrl }, { merge: true });

  // // Return the ID of the new group
  // return newGroupRef.id;
// }

// Function to add a member to a group
// async function addMemberToGroup(groupId, member) {
  // // Add the member to the "members" subcollection of the group document
  // await addDoc(collection(db, `groups/${groupId}/members`), member);
// }

// Get a reference to Firebase Firestore and Authentication
// const db = getFirestore();
// const auth = getAuth();

// // Function to get a group by ID
// async function getGroupById(groupId) {
  // Get the group document from Firestore
  // const groupDoc = await getDoc(doc(db, "groups", groupId));

  // // If the group document doesn't exist, return null
  // if (!groupDoc.exists()) {
  //   return null;
  // }

  // // Get the group data and check if the current user is a member
  // const groupData = groupDoc.data();
  // const currentUser = auth.currentUser;
  // const isMember = currentUser && groupData.members.includes(currentUser.uid);

  // // If the current user is not a member, return null
  // if (!isMember) {
  //   return null;
  // }

  // // Otherwise, return the group data
  // return groupData;
// }

// Example usage: get the group with ID "my-group-id"
// getGroupById("my-group-id").then((groupData) => {
//   if (groupData) {
//     console.log(groupData);
//   } else {
//     console.log("Group not found or user is not a member.");
//   }
// });

// Function to upload an image to a group
// async function uploadImageToGroup(groupId, imageFile) {
  // // Upload the image file to Firebase Storage
  // const imageRef = ref(storage, `groupImages/${groupId}`);
  // await uploadBytes(imageRef, imageFile);

  // // Get the download URL for the image
  // const imageUrl = await getDownloadURL(imageRef);

  // // Update the group document with the image URL
  // await setDoc(doc(db, "groups", groupId), { imageUrl }, { merge: true });
// }

// // Example usage: upload an image file to the group with ID "my-group-id"
// const imageFile = // get the image file from a file input or other source
// uploadImageToGroup("my-group-id", imageFile).then(() => {
//   console.log("Image uploaded to group.");
// });
