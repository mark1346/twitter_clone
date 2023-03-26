import { useState } from 'react';
import { authService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const inputStyles = {};

const AuthForm = () => {
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

            setNewAcc(false);
        } catch(error){
            setAuthError(error.message);

        }
    };

    const toggleAccount = () => setNewAcc(prev => !prev);

    return(
    <>
        <form onSubmit={onSubmit} className="container">
            <input 
                name="email"
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={onChange}
                className="authInput"
            />
            <input 
                name="password"
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={onChange}
                className="authInput"
            />
            <input type="submit" value={newAcc ? "Create Account" : "Log in"} className="authInput authSubmit"/>
            {authError  && <span className="authError">{authError}</span>}
        </form>
        <span onClick={toggleAccount} className="authSwitch">{newAcc? "Log in": "Create Account"}</span>
    </>
    );
}

export default AuthForm;