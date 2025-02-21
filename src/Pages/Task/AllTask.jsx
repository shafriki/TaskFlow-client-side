import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../providers/AuthProvider';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL); // Connect to the server

const AllTask = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [todoTasks, setTodoTasks] = useState([]);
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

        const fetchTodoTasks = async () => {
            if (!user?.email) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/todo/${user.email}`);
                setTodoTasks(response.data);
            } catch (error) {
                console.error('Error fetching To-Do tasks:', error);
            }
        };

        fetchTasks();
        fetchTodoTasks();

        // Listen for real-time task deletion
        socket.on('taskDeleted', (deletedTaskId) => {
            setTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
            setTodoTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        return () => {
            socket.off('taskDeleted');
        };
    }, [user?.email]);

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId)); // Remove task without refreshing
            setTodoTasks(todoTasks.filter(task => task._id !== taskId)); // Update To-Do list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const renderTasks = (taskList, showDeleteButton = true) => (
        taskList.length === 0 ? (
            <p className="text-center text-gray-500">No tasks available.</p>
        ) : (
            <ul className="space-y-4">
                {taskList.map((task) => (
                    <li key={task._id} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                        <div className='flex flex-col w-3/5'>
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-700">{task.description}</p>
                            <p className="text-sm text-gray-500">Category: {task.category}</p>
                            <p className="text-sm text-gray-500">Deadline: {task.deadline || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Added by: {task.email}</p>
                        </div>
                        {showDeleteButton && (
                            <button
                                onClick={() => handleDelete(task._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        )
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 max-w-screen-xl mx-auto">
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-center">All Tasks</h2>
                {loading ? <p className="text-center">Loading tasks...</p> : renderTasks(tasks, true)}
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-center">To-Do</h2>
                {loading ? <p className="text-center">Loading tasks...</p> : renderTasks(todoTasks, false)}
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-center">In Progress</h2>
                {loading ? <p className="text-center">Loading tasks...</p> : renderTasks(tasks.filter(task => task.status === 'In Progress'), false)}
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Done</h2>
                {loading ? <p className="text-center">Loading tasks...</p> : renderTasks(tasks.filter(task => task.status === 'Done'), false)}
            </div>
        </div>
    );
};

export default AllTask;
