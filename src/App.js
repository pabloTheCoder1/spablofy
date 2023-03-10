import React from "react"
import './styles/general.css'
import './styles/buttons.css'
import './styles/upload.css'
import './styles/songs.css'
import './styles/music.css'
import logo from "./images/logo.png"
import Upload from "./Upload.js"
import Music from "./Music.js"

import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import "firebase/compat/storage"
import { useAuthState } from "react-firebase-hooks/auth"

firebase.initializeApp({
  apiKey: "AIzaSyDb9ToVXh6QbqjgbFod3xx30cxmhlIYNlY",
  authDomain: "spablofy-f1c91.firebaseapp.com",
  projectId: "spablofy-f1c91",
  storageBucket: "spablofy-f1c91.appspot.com",
  messagingSenderId: "978587271538",
  appId: "1:978587271538:web:f54480ea6abf40e9291deb",
  measurementId: "G-PRZ15DVRBZ"
})

const auth = firebase.auth();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <header className={`header ${auth.currentUser ? "" : "fixed"}`}>
          {auth.currentUser ? (<>
            <img src={logo} alt="logo" className="logo"/>
            <div className="infos">
              <img src={auth.currentUser.photoURL} 
              alt="profilePicture" className="profilePicture"/>
              <button onClick={() => auth.signOut()}>
                <span>Sign out</span>
                <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="37" cy="37" r="35.5" stroke="white" strokeWidth="3"></circle>
                <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607
                38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076
                37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 
                36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 
                38.5V35.5L25 35.5V38.5Z" fill="white"></path>
                </svg>
              </button>
            </div>
          </>) : (<img src={logo} alt="logo" className="logo"/>)}
          </header>
        <div className="Page">
          {user ? <Home/> : <SignInRoom />}
        </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className='home'>
      <Upload/>
      <Music/>
    </div>
  )
}

function SignInRoom() {
  const SignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
      <div className='signInRoom'>
        <div className="signInButton">
          <button onClick={SignInWithGoogle}>
            <span>Sign in with Google</span>
            <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="37" cy="37" r="35.5" stroke="white" strokeWidth="3"></circle>
                <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607
                38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076
                37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 
                36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 
                38.5V35.5L25 35.5V38.5Z" fill="white"></path>
            </svg>
          </button>
        </div>
      </div>
  )
}


export default App;