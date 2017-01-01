import firebase from "firebase";

const initializeFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      authDomain: "muisti-6a29a.firebaseapp.com",
      apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
      databaseURL: "https://muisti-6a29a.firebaseio.com",
    });
  };
}

export default initializeFirebase;
