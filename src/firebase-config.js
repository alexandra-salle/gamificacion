import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuFX5iGQlbmYFh9TzyqdojcJ6StXBvjlw",
  authDomain: "game-serveis-4e53e.firebaseapp.com",
  projectId: "game-serveis-4e53e",
  storageBucket: "game-serveis-4e53e.appspot.com",
  messagingSenderId: "412487746871",
  appId: "1:412487746871:web:3385056555abe86e5146b2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);



