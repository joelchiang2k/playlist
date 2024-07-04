import { gql } from '@apollo/client';

const ADD_SONG = gql`
  mutation Mutation($name: String, $url: String) {
  addSong(name: $name, url: $url) {
    _id
    createdAt
    name
    url
  }
}
`;

export default ADD_SONG;