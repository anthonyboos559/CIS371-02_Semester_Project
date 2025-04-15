import React, { useEffect, useState } from 'react';
import DonutChart from '../components/chart'; 

function Profile() {
  const [charts, setCharts] = useState([]);
  const [activeChart, setActiveChart] = useState(null);

  useEffect(() => {
      const cookies = document.cookie.split('=');
      if (cookies[0] === 'username') {
        const username = cookies[1];
        fetch(`/api/charts/${username}`)
          .then(res => res.json())
          .then(data => {
            setCharts(data.charts);
          })
          .catch(err => {
            console.error('Error fetching saved charts:', err);
          });
      }
    }, []);
    return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Welcome to the Profile Page</h1>
          <p>Phistory will be saved here!</p>
        </div>
        <div className="col-md-6">
          <img
              src="profile.png"
              alt=""
              className="img-fluid"
          />
        </div>
      </div>
      <h3>Your Saved Charts</h3>
      {charts.length === 0 ? (
        <p>No charts saved yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {charts.map((chart, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {chart.title}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setActiveChart(chart)}
              >
                View Chart
              </button>
            </li>
          ))}
        </ul>
      )}
      {activeChart && (
        <div className="mt-5">
          <DonutChart
            data={activeChart.chartData}
            total={activeChart.totalPerformances}
            filter={activeChart.filterValue}
            title={activeChart.title}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;