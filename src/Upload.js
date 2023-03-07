import React from 'react'
import upload from "./images/upload.png"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage";
import { getStorage, ref, deleteObject, getMetadata } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore"
var file1

firebase.initializeApp({
  apiKey: "AIzaSyA4u7WFVEMqUinHv-WjMDC31EH5u2WFCU0",
  authDomain: "spablofy-5113e.firebaseapp.com",
  projectId: "spablofy-5113e",
  storageBucket: "spablofy-5113e.appspot.com",
  messagingSenderId: "841588959450",
  appId: "1:841588959450:web:4792be0e943ea572609de3",
  measurementId: "G-4F5NG9M5ZP"
  })

const auth = firebase.auth();
const firestore = firebase.firestore();
const store = firebase.storage();
const storage = getStorage();

const Upload = () => {
  const songsRef = firestore.collection("songs");
  const query = songsRef.orderBy('createdAt').limit(200);
  const [songs] = useCollectionData(query, {idField: 'id'});
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
          console.log(file1);
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
            originalName: e.name,
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
            <p>Hello {auth.currentUser.displayName}! Upload or drag your mp3 file right here.</p>
          </div>
          <div className='uploadButton'>
            <input type="file" id="file" onChange={handleChange}/>
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