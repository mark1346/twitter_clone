import { useState} from 'react';
import { storageService, dbService } from 'fbase';
import { ref, uploadString, getDownloadURL} from "firebase/storage";
import { collection,  addDoc } from "firebase/firestore";
import { v4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        if (tweet === ""){
            return;
        }

        event.preventDefault();
        let imageURL = ""
        if(imageSrc !== ""){
            const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(fileRef, imageSrc, "data_url");
            imageURL = await getDownloadURL(response.ref);
        }

        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            imageURL,
        };
        console.log(tweetObj);
        await addDoc(collection(dbService, "tweets"),tweetObj); //tweetObj 형태로 새로운 doc 생성해서 tweets 콜랙션에 넣기
        setTweet("");
        setImageSrc("");
    };

    const onChange = event => {
        const {target: {value}} = event;
        setTweet(value);
    };

    const onFileChange = event => {
        const {target: {files},} = event;
        const theFile = files[0]; //파일 하나만 받을겨
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            // Get the image source data (base64 encoded)
            const imageSrcData = reader.result;
            setImageSrc(imageSrcData);
            setLoading(false); //when image is loaded
            console.log(imageSrcData);
          }, false);
          setLoading(true); //when 
        reader.readAsDataURL(theFile);
    };

    const onClearPhotoClick = () => {
        setImageSrc("");
    };


    return(

        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={tweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>

            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>

            <input 
              id="attach-file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{
                opacity: 0,
                }}
            />
           
        
            {loading && imageSrc ? (
                <p> Image loading...</p>
            ) : !loading && imageSrc ? (
                <>
                    <div className="factoryForm__attachment">
                        <img
                        src={imageSrc}
                        style={{
                            backgroundImage: imageSrc,
                        }}
                        />
                        <div className="factoryForm__clear" onClick={onClearPhotoClick}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                </>
                ) : null }
        </form>
    )
}

export default TweetFactory;