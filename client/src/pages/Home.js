import React from 'react';

function Home() {
    return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Welcome to Phish stats!</h1>
          <p>Login to save your requests or head over to Stats to give the tool a try!</p>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-md-6">
          <h2>Did you know?</h2>
          <p>The Ben & Jerry's "Phish Food" flavor is named after the band!</p>
        </div>
        <div className="col-md-6">
          <img
            src="phish-food.png"
            alt="Responsive"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
    );
}

export default Home;