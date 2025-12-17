import { useEffect, useState } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { initializeApp } from "firebase/app";
// import { getFirestore, initializeFirestore } from "firebase/firestore";

// const useFirebase = () => {
//     const [app, setApp] = useState<any>(undefined);
//     const [db, setDb] = useState<any>(undefined);
//     const [auth, setAuth] = useState<any>(null);
//     const [currentUser, setCurrentUser] = useState<any>(undefined);

//     console.log('db =>', db);
//     console.log('app =>', app);



//     useEffect(() => {
//         const app = initializeApp(sfirebaseConfig);
//         const auth = getAuth(app)
//         const db = initializeFirestore(app, {
//             experimentalForceLongPolling: true
//         })

//         const authListener = onAuthStateChanged(auth, user => {
//             setCurrentUser(user);
//         });
//         if (app) {
//             setApp(app);
//         }
//         if (db) {
//             setDb(db);
//         }
//         if (auth) {
//             setAuth(auth);
//         }

//         return () => {
//             authListener();
//         };
//     }, []);

//     return { app, db, auth, currentUser };
// };

// export default useFirebase;




// // const useFirebase = () => {
// //     const [app, setApp] = useState<FirebaseApp | null>(null);
// //     const [db, setDb] = useState<Firestore | null>(null);
// //     const [auth, setAuth] = useState<Auth | null>(null);
// //     const [currentUser, setCurrentUser] = useState<User | null>(null);
// //     const [storage, setStorage] = useState<FirebaseStorage | null>(null);

// //     useEffect(() => {
// //         const app = initializeApp(sfirebaseConfig);
// //         const db = initializeFirestore(app, {
// //             experimentalForceLongPolling: true
// //         });
// //         const auth = getAuth(app);
// //         const storage = getStorage(app);
// //         setApp(app);
// //         setDb(db);
// //         setAuth(auth);
// //         setStorage(storage);

// //         const unsubscribe = onAuthStateChanged(auth, user => {
// //             setCurrentUser(user);
// //         });
// //         return () => {
// //             unsubscribe();
// //         };
// //     }, []);

// //     return { app, db, auth, storage, currentUser };
// // };

// // export default useFirebase;