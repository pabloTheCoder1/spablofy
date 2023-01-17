import React from 'react'
import firebase from "firebase/compat/app";
import Upload from './Upload';

const Home = () => {
  const auth = firebase.auth();
  return (
    <div className='home'>
      <Upload/>
    </div>
  )
}

export default Home