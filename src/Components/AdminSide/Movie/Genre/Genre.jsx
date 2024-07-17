import React from 'react';
import axios from '../../../../axios';
import './Genre.scss'; // Ensure correct import path
import { toast } from 'react-toastify';

function Genre() {
    const [genres, setGenres] = React.useState([]);
    const [name, setName] = React.useState('');
    const [editingGenre, setEditingGenre] = React.useState(null);

    React.useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await axios.get('movie/genres/');
            console.log(response);
            setGenres(response.data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`movie/genres/${id}/`);
            fetchGenres();
        } catch (error) {
            console.error("Error deleting genre:", error);
        }
    };

    const handleCancel = () => {
        setEditingGenre(null);
        setName('');
    };

    const handleEdit = (genre) => {
        setEditingGenre(genre);
        setName(genre.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const genre = { name };
        try {
            if (editingGenre) {
               const res = await axios.put(`movie/genres/${editingGenre.id}/`, genre);
                toast.success('Succesfully updated', res.data.name)
                handleCancel();
            } else {
                await axios.post('movie/genres/', genre);
                handleCancel();
            }
            fetchGenres();
        } catch (error) {
            console.error("Error saving genre:", error);
        }
    };

    return (
        <div className='admin-genres-container'>
            <h2>Genres</h2>
            <h2>{editingGenre ? 'Edit Genre' : 'Add Genre'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{editingGenre ? 'Update Genre' : 'Create Genre'}</button>
                {editingGenre && <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>}
            </form>
            <ul>
                {genres.map(genre => (
                    <li key={genre.id}>
                        <span className='item'>{genre.name}</span>
                        <button className="edit" onClick={() => handleEdit(genre)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(genre.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Genre;
