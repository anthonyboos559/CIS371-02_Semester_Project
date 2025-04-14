import React from 'react';

function Profile() {
    return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Welcome to the Profile Page</h1>
          <p>Phistory will be saved here!</p>
        </div>
        <div className="col-md-6">
          <img
              src="phishlogo.png"
              alt=""
              className="img-fluid"
          />
        </div>
      </div>
    </div>
    );
}

export default Profile;