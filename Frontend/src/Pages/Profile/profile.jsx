import React from 'react';
import './App.css';

function Profile({auth}) {
    return (
        <div className="Home">
            <header className="App-header">
                <p>
                    You are logged in as {auth && auth.username ? auth.username : null}
                </p>
                <a
                    className="App-link"
                    href={"/auth/logout"}
                >
                    Logout
                </a>
            </header>
        </div>
    );
}

export default Profile;