import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../providers/AuthProvider';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL); // Connect to the server

const AllTask = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.email) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${user.email}`);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

        // Listen for real-time task deletion
        socket.on('taskDeleted', (deletedTaskId) => {
            setTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        return () => {
            socket.off('taskDeleted');
        };
    }, [user?.email]);

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId)); // Remove task without refreshing
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 p-4 max-w-screen-xl mx-auto">
            {/* Sidebar Links */}
            <div className="md:col-span-4 flex flex-col gap-5">
                <Link to="/task" className="btn bg-teal-100 py-6 w-full">Add Tasks</Link>
                <Link to="/alltasks" className="btn bg-teal-100 py-6 w-full">All Tasks</Link>
                <Link to="/tasks/todo" className="btn bg-teal-100 py-6 w-full">To-Do Tasks</Link>
                <Link to="/tasks/inprogress" className="btn bg-teal-100 py-6 w-full">In Progress Tasks</Link>
                <Link to="/tasks/completed" className="btn bg-teal-100 py-6 w-full">Completed Tasks</Link>
            </div>

            {/* Task List */}
            <div className="md:col-span-8 bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-center">All Tasks</h2>
                {loading ? (
                    <p className="text-center">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-center">No tasks available.</p>
                ) : (
                    <ul className="space-y-4">
                        {tasks.map((task) => (
                            <li key={task._id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                                <div className='flex flex-col w-3/5'>
                                    <h3 className="text-lg font-semibold">{task.title}</h3>
                                    <p className="text-gray-700">{task.description}</p>
                                    <p className="text-sm text-gray-500">Category: {task.category}</p>
                                    <p className="text-sm text-gray-500">Deadline: {task.deadline || 'N/A'}</p>
                                    <p className="text-sm text-gray-500">Added by: {task.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AllTask;
