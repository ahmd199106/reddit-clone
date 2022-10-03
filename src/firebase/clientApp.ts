import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCcZ6xYovlHziTWeZZBRk2Yl1_zjcBHZqo',
  authDomain: 'reddit-clone-96420.firebaseapp.com',
  projectId: 'reddit-clone-96420',
  storageBucket: 'reddit-clone-96420.appspot.com',
  messagingSenderId: '792731035646',
  appId: '1:792731035646:web:e7e08b6473f811e7b4c2af',
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
