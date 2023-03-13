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
import { Howl } from "howler";

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
const storage = getStorage();

const Music = () => {
  const songsRef = firestore.collection("songs");
  const orderedSongs = songsRef.orderBy('songName').limit(200);
  const [songs] = useCollectionData(orderedSongs, {idField: 'id'});
  const [paused, setPaused] = useState(false)
  const [namePlaying, setNamePlaying] = useState("Select the song you want to listen")
  const [sound, setSound] = useState(null)
  const [checked, setChecked] = useState(false);
  var selectedSongs = songs && songs.filter((item) => item.uid == auth.currentUser.uid)

  window.onkeypress = function(event) {
    if (event.which == 32) {
      event.preventDefault();
      togglePause()
    }
  }
  
  function togglePause(){
    if (sound.playing()){
      setPaused(!paused)
      sound.pause()
    }
    else{
      sound.play()
      setPaused(!paused)
    }
  }

  const handleSwitchChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="music">
      <div className='playSection'>
        <div className='playAndName'>
          <p>{namePlaying}</p>
          <div className='playButton'>
            <div className='playCircle'>
              <img src={!paused ? play : pause} alt="" className='playIcon' onClick={togglePause}/>
            </div>
          </div>
          <div className='favSwitch'>
          <p>Favourites</p>
          <label className="switch">
            <input type="checkbox" checked={checked} 
            onChange={handleSwitchChange}></input>
            <span className="slider"></span>
          </label>
        </div>
        </div>
      </div>
        {songs && (
        <div className='songs'>
          {selectedSongs && selectedSongs.map(sng =>
         <SingolSong key={sng.songName} song={sng} />)}
        </div>
        )}
    </div>
  )

  function SingolSong(props){
    const{ favourite, createdAt, songName, originalName, songUrl} = props.song;
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
      const picDeleted = ref(storage, "songs/"+ originalName);
      deleteObject(picDeleted);
    }

    const playingSong = new Howl ({
        src: songUrl,
        html5: true,
      })
      
    const callSound = () => {
      if (sound){
        sound.stop()
        if (!paused){
          setPaused(true)
        }
      }
      else{
        setPaused(!paused)
      }
      playingSong.play()
      setSound(playingSong)
      setNamePlaying(trimmedString)
    }

    const windowSize = useRef([window.innerWidth, window.innerHeight]);
    var string = songName;
    var length = windowSize.current[0] > 700 ? 100 : 40
    var trimmedString = string.length > length ? 
      string.substring(0, length - 3) + "..." : 
      string;
    return (
      <div className={`singolSong ${checked & !favourite ? "hidden" : ""}`}>
        <div className='songInfos'>
          <p onClick={() => {callSound()}}>{trimmedString}</p>
          <div className='icons'>
            <svg onClick={toggleFavourite} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
            className={`heart ${heartClass}`}><path d="M20.84 4.61a5.5 5.5 0 0
            0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 
            21.23l7.78-7.78 1.06-1.06a5.5 5.5 6 0 0 0-7.78z"></path></svg>
            <img src={trash} alt="" onClick={deleteSong}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Music