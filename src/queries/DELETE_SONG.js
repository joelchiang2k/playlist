import { gql } from '@apollo/client';

const DELETE_SONG = gql`
 mutation DeleteSong($id: ID!) {
  deleteSong(ID: $id)
}

`;

export default DELETE_SONG;