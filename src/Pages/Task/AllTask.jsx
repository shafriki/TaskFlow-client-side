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
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        category: '',
        deadline: '',
        email: '',
    });

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
            setTasks(tasks.filter(task => task._id !== taskId));
            setTodoTasks(todoTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setTaskForm({
            title: task.title,
            description: task.description,
            category: task.category,
            deadline: task.deadline || '',
            email: task.email || user?.email,
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks/update`, {
                taskId: selectedTask._id,
                updatedTask: taskForm,
            });

            setShowModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const renderTasks = (taskList, showDeleteButton = true) => (
        taskList.length === 0 ? (
            <p className="text-center text-gray-500">No tasks available.</p>
        ) : (
            <ul className="space-y-4">
                {taskList.map((task) => (
                    <li key={task._id} className="p-4 border border-gray-300 rounded-lg flex flex-col justify-between items-start">
                        <div className='flex flex-col w-full mb-4'>
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p className="text-gray-700">{task.description}</p>
                            <p className="text-sm text-gray-500">Category: {task.category}</p>
                            <p className="text-sm text-gray-500">Deadline: {task.deadline || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Added by: {task.email}</p>
                        </div>
                        <div className="w-full flex justify-end space-x-4">
                            <button
                                onClick={() => handleEdit(task)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Edit
                            </button>
                            {showDeleteButton && (
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
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

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">Edit Task</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={taskForm.title}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={taskForm.description}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={taskForm.category}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={taskForm.deadline}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={taskForm.email || user?.email} // Fallback to the current user's email
                                    disabled
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => { setShowModal(false); window.location.reload(); }} className="bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTask;
