import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../providers/AuthProvider';

const Task = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState({
        title: '',
        description: '',
        category: 'To-Do',
        deadline: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.email) {
            Swal.fire({
                title: 'Error!',
                text: 'You must be logged in to add a task.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            setLoading(true);

            const newTask = {
                ...task,
                email: user.email, // Attach the user's email
                timestamp: new Date().toISOString(),
            };

            const response = await fetch('https://your-api-url.com/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            const data = await response.json();

            if (response.ok) {
                setTask({ title: '', description: '', category: 'To-Do', deadline: '' });
                Swal.fire({
                    title: 'Success!',
                    text: 'Task added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data?.message || 'Failed to add task.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error adding task:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong while adding the task.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 p-4 max-w-screen-xl mx-auto">
            <div className="md:col-span-4 flex flex-col gap-5">
                <Link className="btn bg-teal-100 py-6 w-full">All Tasks</Link>
                <Link className="btn bg-teal-100 py-6 w-full">To-Do Tasks</Link>
                <Link className="btn bg-teal-100 py-6 w-full">In Progress Tasks</Link>
                <Link className="btn bg-teal-100 py-6 w-full">Completed Tasks</Link>
            </div>

            <div className="md:col-span-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-center">Add New Task</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={task.title} 
                            onChange={handleChange} 
                            maxLength="50" 
                            required 
                            className="w-full p-2 border border-gray-300 rounded" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea 
                            name="description" 
                            value={task.description} 
                            onChange={handleChange} 
                            maxLength="200" 
                            className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select 
                            name="category" 
                            value={task.category} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Deadline</label>
                        <input 
                            type="date" 
                            name="deadline" 
                            value={task.deadline} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded" 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="User Email"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                            readOnly
                            value={user?.email || ''}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        disabled={loading}
                    >
                        {loading ? 'Adding Task...' : 'Add Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Task;
