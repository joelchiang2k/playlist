const Song = require('../models/Song');


const resolvers = {
    Query: {
        async song(_, {ID}){
            return await Song.findById(ID)
        },
        getSongs: async () => {
            return Song.find()
        },
    },
    Mutation: {
        addSong: async(_, { name, url }) => {
            const newSong = new Song(
                {   
                    name: name, 
                    url: url, 
                    createdAt: new Date().toISOString() 
                }
            );
      
            const res = await newSong.save();
            console.log(res);
            return {
                _id: res._id.toString(),
                ...res._doc
            }
        },
        deleteSong: async(_, {ID}) => {
            const wasDeleted = (await Song.deleteOne({_id: ID})).deletedCount
            return wasDeleted;
        }
    }
}

module.exports = resolvers;