import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8zNvP-HmgOuHPDTv5pePH9xaJ_6nWHhw",
  authDomain: "codexeditor-c074d.firebaseapp.com",
  databaseURL: "https://codexeditor-c074d-default-rtdb.firebaseio.com",
  projectId: "codexeditor-c074d",
  storageBucket: "codexeditor-c074d.appspot.com",
  messagingSenderId: "1021549924769",
  appId: "1:1021549924769:web:11b3dcb2e17534dc7f7be0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

// Export the database reference
export default database;
