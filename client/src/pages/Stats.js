import React, { useState, useEffect } from 'react';
import DonutChart from '../components/chart'; 

function Stats() {

  const [songOptions, setSongOptions] = useState(null);

  const [statType, setStatType] = useState('');

  const [selectedSong, setSelectedSong] = useState('i-cant-get-no-satisfaction');
  const [songFilterType, setSongFilterType] = useState('year');
  const [songState, setSongState] = useState('all');
  const [songYear, setSongYear] = useState('2025');

  const [birthdayShows, setBirthdayShows] = useState(false);
  const [showLocation, setShowLocation] = useState('all');
  const [showFilterType, setShowFilterType] = useState('year');
  const [showState, setShowState] = useState('all');
  const [showYear, setShowYear] = useState('2025');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetch('/api/songs')
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setSongOptions(
          response.data.map(song => ({
            value: song.slug,
            label: song.song,
          })
        ))
      });
  }, []);

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const stateOptions = [];
  states.forEach((state) => {
    stateOptions.push({ value: state, label: state });
  });

  const yearOptions = [];
  for (let year = 2025; year >= 1983; year--) {
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }

  const handleStatTypeClick = (type) => {
    setStatType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    if (statType === "song") {
      if (songFilterType === "state") {
        setFilterValue(songState);
      }
      else {
        setFilterValue(songYear);
      }
    }
    else {
      if (showFilterType === "state") {
        setFilterValue(showState);
      }
      else {
        setFilterValue(showYear);
      }
    }
  
    const statPackage = {
      statType: statType,
      selectedSong: selectedSong,
      songFilterType: songFilterType,
      songYear: songYear,
      songState: songState,
      birthdayShows: birthdayShows,
      showLocation: showLocation,
      showFilterType: showFilterType,
      showState: showState,
      showYear: showYear,
    };
  
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statPackage),
      });
  
      if (!res.ok) {
        const errorMessage = await res.json();
        throw new Error(errorMessage.error);
      }
  
      const data = await res.json();
      setResults(data);

      if (document.cookie) {
        const cookies = document.cookie.split('=');
        if (cookies[0] === 'username') {
          const username = cookies[1];
          const res = await fetch('/api/saveChart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,              
              chartData: data.data,
              total: data.totalPerformances,
              filter: filterValue,
              title: data.title,
            }),
          });
          if (!res.ok) {
            throw new Error('Failed to save chart');
          }
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h1>Stats Request Form</h1>
      <div className="mb-4">
        <h4>Select Stat Type:</h4>
        <button
          type="button"
          className={`btn me-2 ${statType === 'song' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleStatTypeClick('song')}
        >
          Song Stats
        </button>
        <button
          type="button"
          className={`btn ${statType === 'show' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleStatTypeClick('show')}
        >
          Show Stats
        </button>
      </div>
      {statType === 'song' && (
        <div>
          <h3>Song Stats Filters</h3>
          <div className="mb-3">
            <label className="form-label">Select Song:</label>
            <select
              className="form-control"
              value={selectedSong}
              onChange={(e) => setSelectedSong(e.target.value)}
            >
              {songOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Filter By:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="filterYear"
                  name="songFilterType"
                  value="year"
                  className="form-check-input"
                  checked={songFilterType === 'year'}
                  onChange={() => {
                    setSongFilterType('year');
                    setSongYear('2025');
                    setSongState('all');
                  }
                  }
                />
                <label htmlFor="filterYear" className="form-check-label">
                  Year
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="filterState"
                  name="songFilterType"
                  value="state"
                  className="form-check-input"
                  checked={songFilterType === 'state'}
                  onChange={() => {
                    setSongFilterType('state');
                    setSongState('AL');
                    setSongYear('all');
                  }
                  }
                />
                <label htmlFor="filterState" className="form-check-label">
                  State
                </label>
              </div>
            </div>
          </div>
          {songFilterType === 'year' && (
            <div className="mb-3">
              <label className="form-label">Select Year:</label>
              <select
                className="form-control"
                value={songYear}
                onChange={(e) => setSongYear(e.target.value)}
              >
                {yearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {songFilterType === 'state' && (
            <div className="mb-3">
              <label className="form-label">Select State:</label>
              <select
                className="form-control"
                value={songState}
                onChange={(e) => setSongState(e.target.value)}
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      {statType === 'show' && (
        <div>
          <h3>Show Stats Filters</h3>
          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="birthdayCheckbox"
                checked={birthdayShows}
                onChange={(e) => setBirthdayShows(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="birthdayCheckbox">
                Birthday shows
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Filter Type:</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="filterAll"
                  name="showFilterType"
                  value="all"
                  className="form-check-input"
                  checked={showLocation === 'all'}
                  onChange={() => {
                    setShowLocation('all');
                    setShowFilterType('year');
                    setShowYear('2025');
                    setShowState('all');
                  }
                  }
                />
                <label htmlFor="filterAll" className="form-check-label">
                  All
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="filterUS"
                  name="showFilterType"
                  value="usa"
                  className="form-check-input"
                  checked={showLocation === 'usa'}
                  onChange={() => {
                    setShowLocation('usa');
                    setShowFilterType('year');
                    setShowState('all');

                  }
                  }
                />
                <label htmlFor="filterCover" className="form-check-label">
                  USA
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="filterInternational"
                  name="showFilterType"
                  value="international"
                  className="form-check-input"
                  checked={showLocation === 'international'}
                  onChange={() => {
                    setShowLocation('international');
                    setShowFilterType('year');
                    setShowYear('2025');
                    setShowState('all');
                  }
                  }
                />
                <label htmlFor="filterCover" className="form-check-label">
                  International
                </label>
              </div>
            </div>
          {showLocation === 'usa' && (
            <div className="mb-3">
              <label className="form-label">Filter By:</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    id="filterYear"
                    name="showFilterType"
                    value="year"
                    className="form-check-input"
                    checked={showFilterType === 'year'}
                    onChange={() => {
                      setShowFilterType('year');
                      setShowYear('2025');
                      setShowState('all');
                    }
                    }
                  />
                  <label htmlFor="filterYear" className="form-check-label">
                    Year
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    id="filterState"
                    name="showFilterType"
                    value="state"
                    className="form-check-input"
                    checked={showFilterType === 'state'}
                    onChange={() => {
                      setShowFilterType('state');
                      setShowState('AL');
                      setShowYear('all');
                    }
                    }
                  />
                  <label htmlFor="filterState" className="form-check-label">
                    State
                  </label>
                </div>
              </div>
            </div>
          )}
          {showFilterType === 'state' && (
            <div className="mb-3">
              <label className="form-label">Select State:</label>
              <select
                className="form-control"
                value={showState}
                onChange={(e) => {
                  setShowState(e.target.value);
                  setShowYear('all');
                }
                }
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {showFilterType === 'year' && (
            <div className="mb-3">
              <label className="form-label">Filter by Year:</label>
              <select
                className="form-control"
                value={showYear}
                onChange={(e) => {
                  setShowYear(e.target.value);
                  setShowState('all');
                }
                }
              >
                {yearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      )}
      <div className="mt-4">
        <h4>Current Request Configuration:</h4>
        <pre>{JSON.stringify(
          {
            statType,
            ...(statType === 'song' && {
              songFilterType,
              selectedSong,
              songYear,
              songState,
            }),
            ...(statType === 'show' && {
              birthdayShows,
              showFilterType,
              showYear,
              showLocation,
              showState,
            }),
          },
          null,
          2
        )}</pre>
      </div>
      <button type="submit" className="btn btn-success mt-3">
        Submit
      </button>
      {loading && <p>Loading stats...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {results && (
        <div className="mt-4">
          <h4>API Results:</h4>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
      {results && (
        <div className="mt-5">
          <DonutChart
            data={results.data}
            total={results.totalPerformances}
            filter={filterValue}
            title={results.title}
          />
        </div>
      )}
    </form>
  );
}

export default Stats;