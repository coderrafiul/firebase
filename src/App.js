import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);


function App() {

  const [user, setUser]= useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    isValid: false,
    error: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn= ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email}= res.user
      const signedInUser= {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
      
    })
    
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const isValidEmail= email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  

  const handleSignOut= ()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signedOutUser={
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signedOutUser);
    })
    .catch(err=>{

    })
  }

  
  const handleChange= event =>{
    const newUserInfo= {
      ...user
    }



    //Perform Validation

    let isValid= true;

    if(event.target.name === "email"){
      isValid= isValidEmail(event.target.value);
    }

    if(event.target.name === 'password'){
      isValid= event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name]= event.target.value;
    newUserInfo.isValid= isValid;
    setUser(newUserInfo);
  }

  const createAccount= (event) =>{
    if(user.isValid){
     firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
     .then(res=>{
       console.log(res);
       const createdUser= {...user};
       createdUser.isSignedIn= true;
       createdUser.error= '';
       setUser(createdUser);
     })
     .catch(err=>{
       console.log(err.message);
       const createdUser= {...user};
       createdUser.isSignedIn= false;
       createdUser.error= err.message;
       setUser(createdUser);
     })
    }
    else{
      console.log("form is not valid", user)
    }
    event.preventDefault();
    // event.target.reset();
    
  }


  return (
    <div className="App">

      {user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <img src={user.photo} alt=""/>
          <p>Your email: {user.email}</p>
        </div>
      }
      <h1>Our own authentication</h1>
      <form onSubmit={createAccount}>
          <input onBlur={handleChange} type="text" name="name" placeholder= "Your Name" required/>
          <br/>
          <input onBlur={handleChange} type="text" name="email" placeholder= "Your Email" required/>
          <br/>
          <input onBlur={handleChange} type="password" name="password" placeholder="Your Password" required/>
          <br/>
          <button onClick={createAccount} >Create Account</button>
      </form>
      {
        user.error && <p>{user.error}</p>
      }
     
    </div>
  );
}

export default App;
