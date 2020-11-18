"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const data = require("./data/top50");

const handleArtistsNoDuplicates = () => {
  //Get all artists in top50 with duplicates and featurings
  let allArtistsDuplicates = [];
  //Get all artists with duplicates and no featurings
  let allArtistsDuplicatesNoFeaturing = [];
  //Get all artists without duplicate and featurings
  let allArtistsUniqueWithFeaturings = [];
  //Get all artists without duplicate and no featurings
  let allArtistsUnique = [];

  //Populate allArtistsDuplicates
  data.top50.forEach((song) => {
    allArtistsDuplicates.push(song.artist);
  });

  //Populate allArtistsUniqueWithFeaturings
  allArtistsUniqueWithFeaturings = [...new Set(allArtistsDuplicates)];

  //Populate allArtistsDuplicatesNoFeaturings
  allArtistsDuplicatesNoFeaturing = allArtistsDuplicates.map((artist) => {
    if (artist.includes("featuring")) {
      const startSlice = artist.indexOf("featuring");
      return artist.slice(0, startSlice);
    } else {
      return artist;
    }
  });
  //Populate allArtistsUnique
  allArtistsUnique = [...new Set(allArtistsDuplicatesNoFeaturing)];

  return {
    allArtistsUnique: allArtistsUnique,
    allArtistsDuplicates: allArtistsDuplicates,
    allArtistsUniqueWithFeaturings: allArtistsUniqueWithFeaturings,
  };
};

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇

  //Home
  .get("/", (req, res) => {
    res.status(200).json({ status: 200, response: "Server is running..." });
  })

  //Get all songs
  .get("/top50", (req, res) => {
    res.status(200).json({
      status: 200,
      data: data,
    });
  })

  //Get a song by id
  .get("/top50/song/:id", (req, res) => {
    //Check if the id is not out of data array
    if (req.params.id > 0 && req.params.id < data.top50.length) {
      const songId = parseInt(req.params.id);
      res.status(200).json({ status: 200, data: data.top50[songId - 1] });
    } else {
      res
        .status(404)
        .json({ status: 400, response: "Could not find your song" });
    }
  })

  //Get a song by artist name
  .get("/top50/artist/:name", (req, res) => {
    const artistName = req.params.name.toLowerCase();
    const songsFound = [];
    data.top50.forEach((song) => {
      if (song.artist.toLowerCase() === artistName) {
        songsFound.push(song);
      }
    });

    if (songsFound.length !== 0) {
      res.status(200).json({ status: 200, data: songsFound });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "Could not find your song." });
    }
  })

  //Get most popular song
  .get("/top50/popular-artist", (req, res) => {
    let allArtistsDuplicates = handleArtistsNoDuplicates().allArtistsDuplicates;

    //Get all artists without duplicate and featurings : RESULT ARRAY
    let allArtistsUniqueNoFeaturing = [];

    //Populate allArtistsUniqueNoFeaturing RESULT
    handleArtistsNoDuplicates().allArtistsUnique.forEach((artist) => {
      allArtistsUniqueNoFeaturing.push({ artist: artist, count: 0 });
    });

    allArtistsUniqueNoFeaturing.forEach((artistObj) => {
      allArtistsDuplicates.forEach((artistDuplicate) => {
        if (artistDuplicate.includes(artistObj.artist)) {
          artistObj.count += 1;
        }
      });
    });

    //Get most popular artist
    let currentCount = 0;
    let currentMaxCount = 0;
    let currentPopularArtist = {};
    allArtistsUniqueNoFeaturing.forEach((artistObj) => {
      currentCount = artistObj.count;
      if (currentCount > currentMaxCount) {
        currentMaxCount = currentCount;
        currentPopularArtist = artistObj;
      }
    });

    const songs = [];
    data.top50.forEach((song) => {
      if (song.artist.includes(currentPopularArtist.artist)) {
        songs.push(song);
      }
    });

    res.status(200).json({
      status: 200,
      data: { currentPopularArtist: currentPopularArtist, songs: songs },
    });
  })

  .get("/top50/artist", (req, res) => {
    res.status(200).json({
      status: 200,
      data: handleArtistsNoDuplicates().allArtistsUniqueWithFeaturings,
    });
  })

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));