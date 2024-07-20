import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Alert, List, Button, Modal, Form, Input } from "antd";
import { useAuth } from './AuthContext';

export default function Details() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
    const [newNote, setNewNote] = useState({ noteTitle: '', noteDescription: '' });
    const [addButtonDisabled, setAddButtonDisabled] = useState(true);
    const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const isAddButtonDisabled = !newNote.noteTitle || !newNote.noteDescription;
        setAddButtonDisabled(isAddButtonDisabled);
    }, [newNote]);

    useEffect(() => {
        const isUpdateButtonDisabled = !newNote.noteTitle || !newNote.noteDescription;
        setUpdateButtonDisabled(isUpdateButtonDisabled);
    }, [newNote]);

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
            setBook(data);
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

    const handleAddNote = () => {
        setAddModalVisible(true);
    };

    const handleAddModalOk = async () => {
        try {
            const response = await fetch(`http://localhost:8080/addNote/${id}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newNote),
            });

            if (response.status === 403) {
                throw new Error('You don\'t have access to this resource');
            }
            
            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            fetchData();
            setNewNote({ noteTitle: '', noteDescription: '' });
            setAddModalVisible(false);
        } catch (error) {
            setError('Failed to add note');
        }
    };

    const handleAddModalCancel = () => {
        setAddModalVisible(false);
    };

    const handleDetailsNote = (index) => {
        setSelectedNoteIndex(index);
        setNewNote(book.notes[index]);
        setUpdateModalVisible(true);
    };

    const handleUpdateModalOk = async () => {
        try {
            const response = await fetch(`http://localhost:8080/updateNote/${book.notes[selectedNoteIndex].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newNote),
            });

            if (response.status === 403) {
                throw new Error('You don\'t have access to this resource');
            }

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            fetchData();
            setNewNote({ noteTitle: '', noteDescription: '' });
            setUpdateModalVisible(false);
        } catch (error) {
            setError('Failed to update note');
        }
    };
    

    const handleUpdateModalCancel = () => {
        setUpdateModalVisible(false);
    };

    const handleDeleteNote = async () => {
        try {
            const response = await fetch(`http://localhost:8080/deleteNote/${book.notes[selectedNoteIndex].id}`, { 
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 403) {
                throw new Error('You don\'t have access to this resource');
            }
            
            if (!response.ok) {
                throw new Error('Failed to delete note');
            }

            fetchData();
            setNewNote({ noteTitle: '', noteDescription: '' });
            setUpdateModalVisible(false);
        } catch (error) {
            setError('Failed to delete note');
        }
    };

    const handleInputChange = (key, value) => {
        setNewNote(prevNote => ({
            ...prevNote,
            [key]: value
        }));
    };

    if (!book) {
        return <div>Loading...</div>;
    }

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
                <h2>Details</h2>
            </header>
            <div>
                <body>
                    <p><b>Title:</b> {book.title}</p>
                    <p><b>Author:</b> {book.author}</p>
                    <p><b>Genre:</b> {book.genre}</p>
                    <p><b>Number of Pages:</b> {book.nr_pages}</p>
                    
                    <p><b>Notes:</b></p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <Button type="primary" onClick={handleAddNote}>Add Note</Button>
                    </div>

                    <List
                        style={{ backgroundColor: 'white' }}
                        itemLayout="horizontal"
                        dataSource={book.notes}
                        renderItem={(note, index) => (
                            <List.Item style={{ padding: '16px' }}>
                                <List.Item.Meta
                                    title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>{note.noteTitle}</span>}
                                    description={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>{note.noteDescription}</span>}
                                />
                                <div>
                                    <p></p>
                                    <Button type="primary" onClick={() => handleDetailsNote(index)}>Details</Button>
                                </div>
                            </List.Item>
                        )}
                    />

                    <p></p>
                    
                    <Modal
                        title="Add Note"
                        visible={addModalVisible}
                        onOk={handleAddModalOk}
                        onCancel={handleAddModalCancel}
                        okButtonProps={{ disabled: addButtonDisabled }}
                    >
                        <Form>
                            <Form.Item label="Note Title">
                                <Input value={newNote.noteTitle} onChange={e => handleInputChange('noteTitle', e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input.TextArea value={newNote.noteDescription} onChange={e => handleInputChange('noteDescription',  e.target.value)} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Note Details"
                        visible={updateModalVisible}
                        onOk={handleUpdateModalOk}
                        onCancel={handleUpdateModalCancel}
                        okButtonProps={{ disabled: updateButtonDisabled }}
                        footer={[
                            <Button key="delete" type="danger" onClick={handleDeleteNote}>Delete</Button>,
                            <Button key="cancel" onClick={handleUpdateModalCancel}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={handleUpdateModalOk} disabled={!newNote.noteTitle && !newNote.noteDescription}>OK</Button>,
                        ]}
                    >
                        <Form>
                            <Form.Item label="Note Title">
                                <Input value={newNote.noteTitle} onChange={e => handleInputChange('noteTitle', e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input.TextArea value={newNote.noteDescription} onChange={e => handleInputChange('noteDescription', e.target.value)} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </body>
            </div>
        </div>
    );
}
