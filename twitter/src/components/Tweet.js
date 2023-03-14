import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const Tweet = ({tweetObj, isOwner}) => {  
    
    const [editing, setEditing] = useState(false);  //수정 중인지
    const [newTweet, setNewTweet] = useState(tweetObj.text);    //새로운 수정사항
    console.log(tweetObj);
    const tweetTextRef = doc(dbService, "tweets", tweetObj.id);

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(newTweet, tweetObj);
        await updateDoc(tweetTextRef, {
            text: newTweet
        });
        setEditing(false);
    }
    const onChange = event => {
        const {
            target: { value },
        } = event;
        setNewTweet(value);
    }
    const toggleEditing= () => setEditing(prev => !prev);
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        if(ok){
            await deleteDoc(tweetTextRef);
        }
    }
    return(
        <div>
            {editing ? (
                <>
                {isOwner && (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onChange} placeholder="edit the tweet" value={newTweet} required />
                        <input type="submit" value="Update Tweet"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
                )}
                </>
            ) : (
            <>
                <h4>{tweetObj.text}</h4>
                {isOwner && (
                <>
                    <button onClick={onDeleteClick}>Delete</button>
                    <button onClick={toggleEditing}>Edit</button>
                </>
                )}
            </>
            ) }
        </div>  
    );
};
export default Tweet;