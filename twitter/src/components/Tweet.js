import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj, isOwner}) => {  
    
    const [editing, setEditing] = useState(false);  //수정 중인지
    const [newTweet, setNewTweet] = useState(tweetObj.text);    //새로운 수정사항

    const tweetTextRef = doc(dbService, "tweets", tweetObj.id);

    const onSubmit = async (event) => {
        event.preventDefault();
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
        const imageRef = ref(storageService, tweetObj.imageURL);
        if(ok){
            await deleteDoc(tweetTextRef);
        }
        if(tweetObj.imageURL !== ""){
            await deleteObject(imageRef);
        }
        console.log(imageRef);
    }
    return(
        <div className="nweet">
            {editing ? (
                <>
                {isOwner && (
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input 
                            type="text" 
                            onChange={onChange} 
                            placeholder="edit the tweet" 
                            autoFocus
                            value={newTweet} 
                            required 
                            className="formInput"
                        />
                        <input type="submit" value="Update Tweet" className="formBtn" />
                    </form> 
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
                )}
                </>
            ) : (
            <>
                <h4>{tweetObj.text}</h4>
                {tweetObj.imageURL !== "" && <img src={tweetObj.imageURL}/>}
                {isOwner && (
                <div className="nweet__actions">
                    <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                </div>
                )}
            </>
            ) }
        </div>  
    );
};
export default Tweet;