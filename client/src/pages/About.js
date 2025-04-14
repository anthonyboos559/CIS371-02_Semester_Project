import React from 'react';

function About() {
    return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Welcome to the About Page!</h1>
          <p>This website was made with pain and suffering.</p>
        </div>
        <div className="col-md-6">
          <img
              src="phishnet.png"
              alt="Responsive"
              className="img-fluid"
          />
        </div>
      </div>
    </div>
    );
}

export default About;