import {  dbService } from 'fbase';

import { collection, onSnapshot, query } from "firebase/firestore";
import React, {useEffect, useState} from 'react';
import Tweet from 'components/Tweet';

import TweetFactory from 'components/TweetFactory';

const Home = ({userObj}) => {

    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "tweets"),);

        onSnapshot(q, (snapshot)=>{
            const tweetArr = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTweets(tweetArr); //아 방식은 먼저 array를 만들고 set하는 방식임.
        });
    }, []) //일케 하면 component가 mount 될 때 
    
    
    return(
        <div className="container">
            <TweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {tweets.map(tweet => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;