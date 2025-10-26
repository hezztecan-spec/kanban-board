import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB0852qHodyNSbHHjCV5mhRor2ps-dT7YI",
  authDomain: "kanban-board-ae545.firebaseapp.com",
  databaseURL: "https://kanban-board-ae545-default-rtdb.firebaseio.com",
  projectId: "kanban-board-ae545",
  storageBucket: "kanban-board-ae545.firebasestorage.app",
  messagingSenderId: "381097747382",
  appId: "1:381097747382:web:298e530cf48b3532a0d717",
  measurementId: "G-3MT27LX3PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;

