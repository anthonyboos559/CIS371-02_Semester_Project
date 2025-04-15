const express = require('express');
const router = express.Router();
const axios = require('axios');

let cachedSongs = null;
let cachedShows = null;

async function getSongs() {
    const apiKey = process.env.PHISH_API_KEY;
    const url = `https://api.phish.net/v5/songs.json?apikey=${apiKey}`;

    if (!cachedSongs) {
        try {
        const response = await axios.get(url);
        cachedSongs = response.data;
        } catch (err) {
        console.error('Error fetching song data:', err);
        throw err;
        }
    }

    return cachedSongs;
}

async function getShows() {
    const apiKey = process.env.PHISH_API_KEY;
    const url = `https://api.phish.net/v5/shows/artist/phish.json?order_by=showdate&apikey=${apiKey}`;

    if (!cachedShows) {
        try {
            const response = await axios.get(url);
            cachedShows = response.data;
          } catch (err) {
            console.error('Error fetching show data:', err);
            throw err;
          }
    }
    return cachedShows;
}

function songFilterByState(data, state) {
    let counts = {};
    data.forEach(performance => {
        if (performance.state === state){
            counts[performance.showyear] = (counts[performance.showyear] || 0) + 1;
        } 
    });
    return counts;
}

function songFilterByYear(data, year) {
    let counts = {};
    data.forEach(performance => {
        if (performance.showyear === year){
            if (performance.state === "") {
                counts[performance.country] = (counts[performance.country] || 0) + 1
            }
            else {
                counts[performance.state] = (counts[performance.state] || 0) + 1;
            }
        } 
    });
    return counts;
}

function showFilterByState(data, state) {
    let counts = {};
    data.forEach(performance => {
        if (performance.state === state){
            counts[performance.showyear] = (counts[performance.showyear] || 0) + 1;
        } 
    });
    return counts;
}

function showFilterByYear(data, location) {
    let counts = {};
    if (location === "international") {
        data.forEach(performance => {
            if (performance.state === "" && performance.country !== "USA") {
                counts[performance.country] = (counts[performance.country] || 0) + 1
            }
        });
    }
    else {
        data.forEach(performance => {
            if (performance.state === "" && location !== "usa") {
                counts[performance.country] = (counts[performance.country] || 0) + 1
            }
            else {
                counts[performance.state] = (counts[performance.state] || 0) + 1;
            }
        });
    }
    
    return counts;
}

async function getSongStats(statPackage) {
    const apiKey = process.env.PHISH_API_KEY;
    const url = `https://api.phish.net/v5/setlists/slug/${statPackage.selectedSong}.json?apikey=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      const songData = response.data.data || [];
  
      const total = songData.length;
      let counts = {};
      let filterTotal = 0;
      let filter = "";
      let title = "";
  
      if (statPackage.songFilterType === 'state') {
        filter = statPackage.songState;
        counts = songFilterByState(songData, filter);
        filterTotal = Object.keys(counts).length;
        if (filterTotal === 0) {
            throw new Error("No data available!")
        }
        values = Object.values(counts);
        percentage = ((values.reduce((a, b) => a + b, 0) / total) * 100).toFixed(1);
        title = `${values.reduce((a, b) => a + b)} performances of ${statPackage.selectedSong} in ${filter} (${percentage}% of total)`;
      }
      else {
        filter = statPackage.songYear;
        counts = songFilterByYear(songData, filter);
        filterTotal = Object.keys(counts).length;
        if (filterTotal === 0) {
            throw new Error("No data available!")
        }
        values = Object.values(counts);
        percentage = ((values.reduce((a, b) => a + b, 0) / total) * 100).toFixed(1);
        title = `${values.reduce((a, b) => a + b)} performances of ${statPackage.selectedSong} in ${filter} (${percentage}% of total)`;
      }
  
      return {
        totalPerformances: total,
        totalFilter: filterTotal,
        data: counts,
        title: title,
      };
    } catch (err) {
      console.error('Error fetching song stats:', err);
      throw err;
    }
}
  
async function getShowStats(statPackage) {
    const apiKey = process.env.PHISH_API_KEY;
    const url = `https://api.phish.net/v5/shows/showyear/${statPackage.showYear}.json?apikey=${apiKey}`;
    
    if (statPackage.showFilterType === 'state') {
        try {
            const showData = await getShows();
        
            const total = showData.data.length;
            let counts = {};
            let filterTotal = 0;
            let filter = statPackage.showState;
            let title = "";
            
            counts = showFilterByState(showData.data, filter);
            filterTotal = Object.keys(counts).length;
            if (filterTotal === 0) {
                throw new Error("No data available!")
            }
            values = Object.values(counts);
            percentage = ((values.reduce((a, b) => a + b, 0) / total) * 100).toFixed(1);
            title = `${values.reduce((a, b) => a + b)} performances in ${filter} (${percentage}% of total)`;
            
            return {
                totalPerformances: total,
                totalFilter: filterTotal,
                data: counts,
                title: title,
              };

        } catch (err) {
            console.error('Error fetching song stats:', err);
            throw err;
        }
    }
    else {
        try {
            const response = await axios.get(url);
            const showData = response.data.data || [];
        
            const total = showData.length;
            let counts = {};
            let filterTotal = 0;
            let filter = statPackage.showYear;
            let title = "";
            
            counts = showFilterByYear(showData, statPackage.showLocation);
            filterTotal = Object.keys(counts).length;
            if (filterTotal === 0) {
                throw new Error("No data available!")
            }
            values = Object.values(counts);
            percentage = ((values.reduce((a, b) => a + b, 0) / total) * 100).toFixed(1);
            title = `${values.reduce((a, b) => a + b)} ${statPackage.showLocation === "all" ? "" : statPackage.showLocation} performances in ${filter} (${percentage}% of total)`;
            
            return {
                totalPerformances: total,
                totalFilter: filterTotal,
                data: counts,
                title: title,
              };

        } catch (err) {
            console.error('Error fetching show stats:', err);
            throw err;
        }
    }
}

router.use('/api/songs', (req, res) => {
    getSongs()
    .then((songs) => res.json(songs))
    .catch((err) => console.error('Error sending song list:', err));
});

router.post('/api/stats', (req, res) => {
    const statPackage = req.body;
  
    let statsPromise;
  
    if (statPackage.statType === 'song') {
      statsPromise = getSongStats(statPackage);
    } else if (statPackage.statType === 'show') {
      statsPromise = getShowStats(statPackage);
    } else {
      return res.status(400).json({ error: 'Invalid statType' });
    }
  
    statsPromise.then((data) => {
        res.json(data);
    }
    ).catch((err) => {
        console.error('Error in statsPromise:', err);
        res.status(500).json({ error: err.message });
    });
  }
);

module.exports = router;
