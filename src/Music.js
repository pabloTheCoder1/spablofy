import React from 'react'
import play from "./images/play.png"
import pause from "./images/pause.png"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useState } from "react"
import { query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "firebase/firestore";

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

const Music = () => {
  const songsRef = firestore.collection("songs");
  const orderedSongs = songsRef.orderBy('createdAt').limit(200);
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
      <div className='songs'>
        {songs && (
        <div className='songs'>
          {selectedSongs && selectedSongs.map(sng => 
         <SingolSong key={sng.id} song={sng} />)}
        </div>
        )}
      </div>
    </div>
  )

  function SingolSong(props){
    const{ uid, time, favourite, createdAt, songName } = props.song;
    return (
      <div className='singolSong'>
        <p>{songName}</p>
      </div>)
  }
}

export default Music