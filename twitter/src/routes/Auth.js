import { authService } from 'fbase';
import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, GithubAuthProvider,signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, OAuthProvider} from "firebase/auth";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAcc, setNewAcc] = useState(true);
    const [authError, setAuthError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            let data;
            if(newAcc){
                data = await createUserWithEmailAndPassword(authService, email, password);
             } else{
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
            setNewAcc(false);
        } catch(error){
            setAuthError(error.message);
            console.log(error);
        }
    };

    const toggleAccount = () => setNewAcc(prev => !prev);
    const onSocialClick = async (event) => {
        const {target: {name}, } = event;
        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();

        }else if (name==="Github"){
            provider = new GithubAuthProvider();
        }

        const result = await signInWithPopup(authService, provider);
        const user = result.user;

        // const credential = provider.credentialFromResult(result);
        // const token = credential.accessToken;
        console.log(result)
    };

    return (
    <div>
        <form onSubmit={onSubmit}>
            <input 
                name="email"
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={onChange}
            />
            <input 
                name="password"
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={onChange}
            />
            <input type="submit" value={newAcc ? "Create Account" : "Log in"} />
            {authError}
        </form>
        <span onClick={toggleAccount}>{newAcc? "Log in": "Create Account"}</span>
        <div>
            <button name="google" onClick={onSocialClick}>Continue with Google</button>
            <button name="Github" onClick={onSocialClick}>Continue with Github</button>
        </div>
    </div>
    );
}
export default Auth;