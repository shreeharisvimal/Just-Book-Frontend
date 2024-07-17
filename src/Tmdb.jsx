import axios from "axios";

export const baseUrl = 'https://api.themoviedb.org/3';
export const API_KEY = '61169c6f28859e94729d211960eaef62';
export const imageUrl = 'https://image.tmdb.org/t/p/original'
export const TeaserUrl=(movieId)=>{
   return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
};


export const MovieDetailsFetch= async(movieId)=>{
    const movie_id = movieId;
    try{
        const response = await axios.get(`${baseUrl}/movie/${movie_id}`, {
            params:{
                api_key: API_KEY,
                append_to_response: 'videos,images,credits,reviews,similar,keywords'
            }
        })
        return response

    }catch(error){
        console.log('An error while fetching the movie details')
    }
};


export const CreateMovieMatch= async (movie_name)=>{
    const url = `https://api.themoviedb.org/3/search/movie?query=${movie_name}&api_key=${API_KEY}`
 
    console.log('the urls', url)
    try{    
        const resp = await axios.get(url)
        console.log(resp)
        return resp.data.results;
    }catch(error){
        console.error('error while fetching movies', error)
        return [];
    }

};

const tmdb = axios.create({
    baseURL:baseUrl,
    params:{
        api_key:API_KEY
    }
})

export default tmdb;