import React, { useEffect, useState} from 'react';
import {authService, dbService} from 'fbase';
import { useHistory } from 'react-router-dom';
import { getDocs, query, collection, where, orderBy} from 'firebase/firestore';
import Tweet from 'components/Tweet.js'
import { updateProfile } from 'firebase/auth';

const Profile = ({ userObj, onDisplayNameChange}) => {
    const [tweets, setTweets] = useState([]);
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    const getMyTweets = async () => {
        //쿼리 만드는 이유 -> firestore에서 nosql 데이터베이스 쓰고 있음. 
        const q = query(
            collection(dbService, "tweets"), 
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt"),
            );

        // retrieve the documents that match the query
        const querySnapshot = await getDocs(q);

        const myTweets = [];

        //Loop through each document in the query snapshot
        querySnapshot.forEach(doc => {
            myTweets.push({id: doc.id, ...doc.data()});
            console.log(doc.id, "=>", doc.data());
        });
        setTweets(myTweets);
    }

    useEffect(() => {
        getMyTweets();
    }, []);

    const onChange = event => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    };
    
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(newDisplayName);
        onDisplayNameChange(newDisplayName);
        if(userObj.displayName !== newDisplayName){
            await updateProfile(userObj, {
                displayName: newDisplayName
            });
        }
    };
    
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    onChange={onChange}
                    type="text" 
                    autoFocus
                    placeholder="Display name" 
                    value = {newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            {tweets.map(tweet => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
                ))}
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
};

export default Profile;