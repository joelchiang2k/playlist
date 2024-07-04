import { useQuery, gql } from '@apollo/client';

const useFetch = () => {
    const GET_SONGS = gql`
        query Songs {
            getSongs {
                _id
                name
                url
            }
        }
        `;
    const { loading, error, data, refetch } = useQuery(GET_SONGS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return { data, refetch };
}

export default useFetch;