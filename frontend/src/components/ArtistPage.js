import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Content from "./Content";
import SongList from "./SongList";

const ArtistPage = () => {
  const { artistName } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch(`/top50/artist/${artistName}`)
      .then((res) => res.json())
      .then((json) => {
        setSongs(json.data);
      });
  }, []);

  console.log("ArtistPage.js: songs: ", songs);

  return (
    <>
      <Header pageTitle={`Songs by ${artistName}`} />
      <Content>
        <SongList allSongs={songs} />
      </Content>
    </>
  );
};

export default ArtistPage;