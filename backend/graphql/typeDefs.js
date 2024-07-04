const { gql } = require('apollo-server');

module.exports = gql`
    type Song {
        _id: ID!
        name: String
        url: String
        createdAt: String
    }
    
    type Query {
        song(ID: ID!): Song!
        getSongs: [Song]
    }

    type Mutation {
        addSong(name: String, url: String): Song
        deleteSong(ID: ID!): Boolean
    }
`;