import { authService } from 'fbase';
import { GoogleAuthProvider, GithubAuthProvider,signInWithPopup } from "firebase/auth";
import AuthForm from 'components/AuthForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
    
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
    };
    

    return (
    <div className="authContainer">
        <FontAwesomeIcon
            icon={faTwitter}
            color={"#04AAFF"}
            size="3x"
            style={{ marginBottom: 30 }}
        />
       <AuthForm />
       <div className="authBtns">
            <button onClick={onSocialClick} name="google" className="authBtn">
                Continue with Google <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button name="Github" onClick={onSocialClick} className="authBtn">
                Continue with Github <FontAwesomeIcon icon={faGithub} />
            </button>
        </div>
    </div>
    );
}
export default Auth;