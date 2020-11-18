import React from "react";
import styled from "styled-components";

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  font-family: "Hind", sans-serif !important;
  h5 {
    font-weight: 200;
    font-style: italic;
  }
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  height: 100px;
`;

const Rank = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-left: 100px;
`;

const Date = styled.div`
  display: flex;
  align-items: flex-end;
  width: 30%;
  p {
    font-size: 12px;
  }
`;

const SongList = ({ allSongs }) => {
  return (
    <List allSongs={allSongs}>
      {allSongs.map((song) => {
        return (
          <>
            <ListItem key={song.rank}>
              <Rank>
                <h1>#{song.rank}</h1>
                <p>({song.streams})</p>
              </Rank>
              <Title>
                <h3 style={{ margin: "0" }}>{song.title}</h3>
                <h5>by {song.artist}</h5>
              </Title>
              <Date>
                <p>publication date: {song.publicationDate}</p>
              </Date>
            </ListItem>
            <hr style={{ width: "100%" }} />
          </>
        );
      })}
    </List>
  );
};

export default SongList;