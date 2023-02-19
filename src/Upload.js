import React from 'react'
import upload from "./images/upload.png"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore"
var file1

firebase.initializeApp({
  apiKey: "AIzaSyCI-m2KDJP5_pGbSCm4uCYNxY2882egk7c",
  authDomain: "spablofy.firebaseapp.com",
  projectId: "spablofy",
  storageBucket: "spablofy.appspot.com",
  messagingSenderId: "444494815294",
  appId: "1:444494815294:web:33311a35ea003ccbc0b16f",
  measurementId: "G-2G7S4M90BR"
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
        console.log(file1)
        SendFirebase(file1)
      }

    const SendFirebase = async(e) => {
      const today = new Date();
      const{ uid } = auth.currentUser; 
      await songsRef.add({
        songName: e.name,
        originalName: e.name,
        favourite: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
      }); 
      if (e){
        const uploadTask = store.ref(`songs/${e.name}`).put(e);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            alert(error)
          },
        );
      }
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
              <p>drop it</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default Upload