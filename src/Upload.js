import React from 'react'
import upload from "./images/upload.png"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage";
var file1

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
const firestore = firebase.firestore();
const store = firebase.storage();

const Upload = () => {
  const songsRef = firestore.collection("songs");
    function dropHandler(ev) {
      ev.preventDefault();
      if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item) => {
          if (item.kind === 'file') {
            file1 = item.getAsFile();
            console.log(file1);
          }
        });
      } else {
        [...ev.dataTransfer.files].forEach((file) => {
          file1 = file
        });
      }
      SendFirebase(file1)
    }
    
    function dragOverHandler(ev) {
      ev.preventDefault();
    }

    const handleChange = (ev) => {
        ev.preventDefault()
        file1 = ev.target.files[0]
        SendFirebase(file1)
      }

    const SendFirebase = async(e) => {
      const{ uid } = auth.currentUser; 
      store.ref(`songs/${e.name}`).put(e)
        .then(() => {
          const storageRef = store.ref("/songs")
          storageRef.child(e.name).getDownloadURL()
        .then(url => {
          let songURL = url
          songsRef.add({
            songUrl: songURL,
            songName: e.name,
            favourite: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
          })
        })
      })
      alert("file uploaded correctly")
    }

    return (
      <div className='uploadSection'>
        <div className='upload'>
          <div className="typewriter">
            <p>Hello {auth.currentUser.displayName}! Upload or drag your .mp3 file right here.</p>
          </div>
          <div className='uploadButton'>
            <input type="file" id="file" accept="audio/mp3" onChange={handleChange}/>
            <label htmlFor="file">
                <p>Upload</p><img src={upload} alt="image" className="pickImage"/>
            </label>
          </div>
          <div className='dragit'>
            <div className="dropzone" id="drop_zone"
              onDrop={dropHandler} onDragOver={dragOverHandler}>
              <p>Drop it</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default Upload