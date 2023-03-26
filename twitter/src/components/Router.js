
import {HashRouter as Router, Route, Switch, BrowserRouter, Redirect} from "react-router-dom"
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';


const AppRouter = ({isLoggedIn, userObj, displayName, onDisplayNameChange}) => {
    return (
    <BrowserRouter>
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} displayName={displayName}/>} 
            <Switch>
                {isLoggedIn ? (
                <div
                    style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Route exact path ="/">
                        <Home userObj={userObj}/>
                    </Route>
                    <Route exact path="/profile">
                        <Profile userObj={userObj} onDisplayNameChange={onDisplayNameChange}/>
                    </Route>
                    <Redirect from="*" to="/"/>
                </div>
                ) : (
                    <>
                <Route exact path = "/">
                    <Auth/>
                </Route>
                <Redirect from="*" to="/"/>
                </>
                )}
            </Switch>
        </Router>
    </BrowserRouter>
    );
};

export default AppRouter;