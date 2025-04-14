import React from 'react';

function Logout() {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>You're logged out!</h1>
          <p>Keep jamming!</p>
        </div>
        <div className="col-md-6">
          <img
              src="phish-poster-may-25-1994-may-27-1994.jpg"
              alt=""
              className="img-fluid"
          />
        </div>
      </div>
    </div>
    );
}

export default Logout;