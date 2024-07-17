import React, { useEffect, useState } from 'react';
import axios from '../../../../Admin_axios';
import tmdb, {TeaserUrl} from '../../../../Tmdb';
import { toast } from 'react-toastify';

const PostMovieForm = ({ movie, onMoviePosted }) => {
  const INIT_STATE = {
    title: movie.title,
    tmdb_id: movie.id,
    poster_path: movie.poster_path || 'PosterPath is None',
    background_path: movie.backdrop_path || 'BackGroundPath is None',
    release_date : movie.release_date,
    language:movie.original_language || 'en',
    video_key: '',
  };

  const [form, setForm] = useState(INIT_STATE);

  const handlePostMovie = async () => {
    try {
        console.log('the form', form)
        const resp = await axios.post('/movie/movieListCreateAPIView/', form);
        if (resp.status === 201) {
            toast.success('The movie has been added');
            onMoviePosted();
        }
    } catch (error) {
    console.log('An error has been found:', error);
    }
};


  useEffect(() => {
    const getVideoKey = async () => {
      try {
        const response = await tmdb.get(`/movie/${movie.id}/videos`);
        console.log('the response from video', response)
        if (response.status === 200 ) {
          if(response.data.results.length > 0){
                console.log('the length greater thean one ', response.data.results[0].key)
                setForm({...form,video_key: response.data.results[0].key});
            }else{
                toast.warning('The movie does not have a teaser');
                setForm({...form,video_key: 'NO TEASER'});
            }

          console.log('the data or form before the submittion', form)
        }
      } catch (error) {
        console.log('An error has occurred while fetching teaser:', error);
      }
    };
    if(form.video_key){
        handlePostMovie()
    }
    else{
        console.log('the objected mounted')
        getVideoKey();
}
  
  }, [movie.id, form.video_key]);

        
    return null;

};

export default PostMovieForm;
