import React from 'react'
import play from "./images/play.png"
import pause from "./images/pause.png"
import trash from "./images/trash.png"
import edit from "./images/edit.png"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useState, useRef } from "react"
import "firebase/firestore";
import { setDoc, doc } from "firebase/firestore";

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
const storage = getStorage();

const Music = () => {
  const songsRef = firestore.collection("songs");
  const orderedSongs = songsRef.orderBy('songName').limit(200);
  const [songs] = useCollectionData(orderedSongs, {idField: 'id'});
  const [paused, setPaused] = useState(false)
  const selectedSongs = songs && songs.filter((item) => item.uid == auth.currentUser.uid)
  let img = play
  function toggleCheck() {
    setPaused(!paused)
  }
  if (!paused) {
    img = play
  }
  else {
    img = pause
  }
  return (
    <div className="music">
      <div className='playSection'>
        <div className='playAndName'>
          <p>Dream it</p>
          <div className='playButton'>
            <img src={img} alt="" className='playIcon' onClick={toggleCheck}/>
          </div>
        </div>
      </div>
        {songs && (
        <div className='songs'>
          {selectedSongs && selectedSongs.map(sng =>
         <SingolSong key={sng.id} song={sng} />)}
        </div>
        )}
    </div>
  )

  function SingolSong(props){
    const{ uid, favourite, createdAt, songName, originalName } = props.song;
    const[liked, setLiked] = useState(favourite)
    const heartClass = liked ? 'liked' : 'unliked';

    const toggleFavourite = async () => {
      setLiked(!liked)
      const snapshot = await firestore
        .collection("songs")
        .limit(1)
        .where("createdAt", "==", createdAt)
        .get();

      const toggledDoc = snapshot.docs[0];
      const songRef = firestore.collection('songs').doc(toggledDoc.id);
      songRef.update({"favourite": !favourite});
    }

    const deleteSong = async () => {
      const snapshot = await firestore
      .collection("songs")
      .limit(1)
      .where("createdAt", "==", createdAt)
      .get();

      const toggledDoc = snapshot.docs[0];
      const songRef = firestore.collection('songs').doc(toggledDoc.id);
      songRef.delete()
      const picDelete = ref(storage, "songs/"+ originalName);
      deleteObject(picDelete);
    }

    var windowSize = useRef([window.innerWidth, window.innerHeight]);
    var string = songName;
    var length = 40
    var trimmedString = string.length > length ? 
      string.substring(0, length - 3) + "..." : 
      string;
    return (
      <div className='singolSong'>
        <div className='songInfos'>
          <p>{trimmedString}</p>
          <div className='icons'>
            <svg onClick={toggleFavourite} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
            className={`heart ${heartClass}`}><path d="M20.84 4.61a5.5 5.5 0 0
            0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 
            21.23l7.78-7.78 1.06-1.06a5.5 5.5 6 0 0 0-7.78z"></path></svg>
            <img src={edit} alt="" />
            <img src={trash} alt="" onClick={deleteSong}/>
          </div>
        </div>
      </div>)
  }
}


export default Music