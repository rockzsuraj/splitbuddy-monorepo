import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Image,
} from "react-native";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Initialize Firebase in your app, e.g. in App.tsx or index.tsx
// Make sure to import and initialize the necessary Firebase modules

type CreateGroupFormData = {
  name: string;
  description: string;
  image?: File | null;
};

type CreateGroupFormErrors = {
  name?: string;
  description?: string;
  image?: string;
};

const CreateGroupForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    description: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState<CreateGroupFormErrors>({});

  const handleFormSubmit = async () => {
    const errors: CreateGroupFormErrors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }
    // if (!formData.image) {
    //   errors.image = "Image is required.";
    // }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Get a reference to Firebase storage and Firestore
      const storage = getStorage();
      const db = getFirestore();

      // Get the current user from Firebase Authentication
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User is not signed in.");
      }

      // Create a new document in the "groups" collection
      const newGroupRef = await addDoc(collection(db, "groups"), {
        name: formData.name,
        description: formData.description,
        members: [currentUser.uid],
      });

      // Upload the image file to Firebase Storage
      const imageRef = ref(storage, `groupImages/${newGroupRef.id}`);
      await uploadBytes(imageRef, formData.image);

      // Get the download URL for the image
      const imageUrl = await getDownloadURL(imageRef);

      // Update the group document with the image URL
      await setDoc(doc(db, "groups", newGroupRef.id), { imageUrl }, { merge: true });

      // Add the new group to the user's list of groups
      await setDoc(doc(db, "users", currentUser.uid), {
        groups: [newGroupRef.id],
      }, { merge: true });

      // Reset the form data and errors
      setFormData({ name: "", description: "", image: null });
      setFormErrors({});

      console.log("Group created successfully.");
    } catch (error) {
      console.error(error);
      alert("Error creating group. Please try again later.");
    }
  };

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files?.length) {
  //     setFormData({
  //       ...formData,
  //       image: event.target.files[0],
  //     });
  //   }
  // };

  return (
    <SafeAreaView>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Create a new group
        </Text>
        <TextInput
          placeholder="Group name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}
        />
        {formErrors.name && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {formErrors.name}
          </Text>
        )}
        <TextInput
          placeholder="Group description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          style={{ borderWidth: 1, borderColor: "black", marginBottom: 10 }}
        />
        {formErrors.description && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {formErrors.description}
          </Text>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginRight: 10 }}>Group image:</Text>
          {formData.image ? (
            <Image
              source={{ uri: URL.createObjectURL(formData.image) }}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
          ) : (
            <Text>No image selected</Text>
          )}
          {/* <Button
            title="Choose file"
            onPress={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.addEventListener("change", handleImageChange);
              input.click();
            }}
          /> */}
        </View>
        {formErrors.image && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {formErrors.image}
          </Text>
        )}
        <Button title="Create group" onPress={handleFormSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default CreateGroupForm;