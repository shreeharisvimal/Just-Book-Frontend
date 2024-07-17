import React from 'react';
import axios from '../../../../axios';
import './Language.scss';
import { toast } from 'react-toastify';

function Language() {
    const [language, setLanguage] = React.useState([]);
    const [name, setName] = React.useState('');
    const [editingLanguage, setEditingLanguage] = React.useState(null);

    React.useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await axios.get('movie/language/');
            setLanguage(response.data);
        } catch (error) {
            console.error("Error fetching Languages:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`movie/language/${id}/`);
            toast.warning('You have deleted a language')
            fetchLanguages();
        } catch (error) {
            console.error("Error deleting language:", error);
        }
    };

    const handleCancel = () => {
        setEditingLanguage(null);
        setName('');
    };

    const handleEdit = (language) => {
        setEditingLanguage(language);
        setName(language.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const language = { name };
        try {
            if (editingLanguage) {
               const res = await axios.put(`movie/language/${editingLanguage.id}/`, language);
                toast.success('Succesfully updated', res.data.name)
                handleCancel();
            } else {
                await axios.post('movie/language/', language);
                toast.success('Succesfully created a Language')
                handleCancel();
            }
            fetchLanguages();
        } catch (error) {
            console.error("Error saving language:", error);
        }
    };

    return (
        <div className='admin-language-container'>
            <h2>Languages</h2>
            <h2>{editingLanguage ? 'Edit Language' : 'Add Language'}</h2>
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
                <button type="submit">{editingLanguage ? 'Update Language' : 'Create Language'}</button>
                {editingLanguage && <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>}
            </form>
            <ul>
                {language.map(Langu => (
                    <li key={Langu.id}>
                        <span className='item'>{Langu.name}</span>
                        <button className="edit" onClick={() => handleEdit(Langu)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(Langu.id)}>Delete</button>
                    </li>   
                ))}
            </ul>
        </div>
    );
}

export default Language;
