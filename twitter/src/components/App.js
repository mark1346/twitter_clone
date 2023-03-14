import AppRouter from 'components/Router';
import React, {useEffect, useState} from 'react';
import { authService } from 'fbase';


function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); //로그인 된 지 모름 아직.
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged( user => { //이새끼가 Auth State의 변경을 감지하고 함수 trigger. 로그인 되면 ㅇㅇ
      if(user){
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);

  return (
  <>
    {init? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
    <footer>&copy; {new Date().getFullYear()} Twitter</footer>
  </>
  );
}

export default App;
