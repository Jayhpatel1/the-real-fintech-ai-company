import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "the-real-fintech-ai-company.firebaseapp.com",
  projectId: "the-real-fintech-ai-company",
  storageBucket: "the-real-fintech-ai-company.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

let app: any;
let auth: any;
let firestore: any;
let storage: any;
let functions: any;

export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    functions = getFunctions(app);
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
};

export { auth, firestore, storage, functions };