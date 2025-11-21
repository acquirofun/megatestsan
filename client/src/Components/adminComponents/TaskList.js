import React from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';
import TaskForm from './TaskForm';
import TaskService from '../../services.js/api';

const TaskList = ({ type, title }) => {
    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isFormVisible, setIsFormVisible] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState(null);

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await TaskService.getTasks(type);
        if (data.success) {
          setTasks(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    React.useEffect(() => {
      fetchTasks();
      // eslint-disable-next-line
    }, [type]);
   
    const handleAdd = async (taskData) => {
      try {
        const data = await TaskService.addTask(type, taskData);
        if (data.success) {
          fetchTasks();
          setIsFormVisible(false);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleEdit = async (taskData) => {
      try {
        const data = await TaskService.editTask(type, taskData.id, taskData);
        if (data.success) {
          fetchTasks();
          setEditingTask(null);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        try {
          const data = await TaskService.deleteTask(type, id);
          if (data.success) {
            fetchTasks();
          } else {
            throw new Error(data.message);
          }
        } catch (err) {
          setError(err.message);
        }
      }
    };
  
    if (loading) {
      return <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
  
    if (error) {
      return <div className="bg-cards p-4 rounded-md text-red-500">{error}</div>;
    }
  
    return (
        <div id='refer' className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[20px] font-semibold">{title}</h1>
          <button
            onClick={() => setIsFormVisible(true)}
            className="px-4 py-3 text-sm font-medium text-white bg-btn rounded-md hover:bg-yellow-600"
          >
            Add New Task
          </button>
        </div>
  
        {(isFormVisible || editingTask) && (
          <div className="mb-6">
            <TaskForm
              task={editingTask}
              type={type}
              onSubmit={editingTask ? handleEdit : handleAdd}
              onCancel={() => {
                setIsFormVisible(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}
  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#282828] rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {task.icon && (
                    <img src={task.icon} alt="" className="w-8 h-8 mr-3" />
                  )}
                  <h3 className="text-lg font-medium">{task.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">Bonus: {task.bonusAmount}</p>
                {task.chatId && (
                  <p className="text-sm">Chat ID: {task.chatId}</p>
                )}
                {task.description && (
                  <p className="text-sm mt-2">{task.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
export default TaskList;