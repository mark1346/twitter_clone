import { dbService } from 'fbase';
import { collection, addDoc, getDocs, orderBy, onSnapshot, query } from "firebase/firestore";
import React, {useEffect, useState} from 'react';
import Tweet from 'components/Tweet';

const Home = ({userObj}) => {
    const [tweet, setTweet] = useState("");

    const [tweets, setTweets] = useState([]);

    //getTweets를 useEffect에서 분리한 이유 -> async 써야 됨
    // const getTweets = async()=>{ 
    //     const dbTweets = await getDocs(collection(dbService, "tweets"));
    //     dbTweets.forEach(doc => {
    //         const tweetObject = {
    //             ...doc.data(),
    //             id: doc.id,
    //         };
    //         setTweets(prev => [tweetObject, ...prev]);
    //     });
    // }

    useEffect(() => {
        // getTweets();
        const q = query(collection(dbService, "tweets"),);
        console.log(q);
        onSnapshot(q, (snapshot)=>{
            const tweetArr = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTweets(tweetArr); //아 방식은 먼저 array를 만들고 set하는 방식임.
        });
    }, []) //일케 하면 component가 mount 될 때 
    
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "tweets"),{
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setTweet(""); //submit 하고나서 초기화
    };

    const onChange = event => {
        const {target: {value}} = event;
        setTweet(value);
    };
    return(
        <div>
            <form onSubmit = {onSubmit}>
                <input value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="Tweet"/>
            </form>
            <div>
                {tweets.map(tweet => (
                    <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;