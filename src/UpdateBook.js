import { useParams, useNavigate } from "react-router-dom";
import './CRUDstyle.css';
import React, { useState, useEffect } from 'react';
import { Input, Button, Alert } from 'antd';
import { useAuth } from './AuthContext';

export default function UpdateBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [updatedBook, setUpdatedBook] = useState({ title: '', author: '', genre: '', nr_pages: '' });
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your internet connection.');
            }

            const response = await fetch(`http://localhost:8080/details/${id}`, { method: 'GET', headers: {Authorization: `Bearer ${token}` } });
            
            if (response.status === 403) {
                throw new Error('You don\'t have access to this resource');
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch book details');
            }

            const data = await response.json();
            setUpdatedBook(data);
        } catch (error) {
            if (error.message === 'You don\'t have access to this resource') {
                setError(error.message);
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
              setError('Failed to fetch data from the server. The server might be down.');
            } else {
              setError(error.message);
            }
        }
    };

    const handleInputChange = (e, key) => {
        const { value } = e.target;
        setUpdatedBook(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your internet connection.');
            }

            const response = await fetch(`http://localhost:8080/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedBook)
            });

            if (response.status === 403) {
                throw new Error('You don\'t have access to this resource');
            }
            
            if (!response.ok) {
                throw new Error('Failed to update book');
            }

            navigate('/all');
        } catch (error) {
            if (error.message === 'You don\'t have access to this resource') {
                setError(error.message);
            } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
              setError('Failed to fetch data from the server. The server might be down.');
            } else {
              setError(error.message);
            }
        }
    };

    const isUpdateDisabled = Object.values(updatedBook).some(value => value === '');

    return (
        <div>
            <header>
                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        closable
                        onClose={() => setError(null)}
                    />
                )}
                <h2>Update</h2>
            </header>
            <div className="CRUD-style">
                <body>
                    <p><b>Title:</b> <Input value={updatedBook.title} size="large" onChange={(e) => handleInputChange(e, 'title')} /></p>
                    <p><b>Author:</b> <Input value={updatedBook.author} size="large" onChange={(e) => handleInputChange(e, 'author')} /></p>
                    <p><b>Genre:</b> <Input value={updatedBook.genre} size="large" onChange={(e) => handleInputChange(e, 'genre')} /></p>
                    <p><b>Number of Pages:</b> <Input value={updatedBook.nr_pages} size="large" onChange={(e) => handleInputChange(e, 'nr_pages')} /></p>
                    <Button size="large" onClick={handleUpdate} disabled={isUpdateDisabled}><b>UPDATE</b></Button>
                </body>
            </div>
        </div>
    );
}
