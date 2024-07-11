import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    if (window.ANDROID) {
      const androidTasks = JSON.parse(window.ANDROID.getTasks());
      setTasks(androidTasks);
    } else {
      try {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
          setTasks(savedTasks);
        }
      } catch (error) {
        console.error('Error accessing localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!window.ANDROID) {
        try {
          localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
          console.error('Error saving to localStorage', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tasks]);

  const addTask = () => {
    if (task.trim()) {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      setTask('');
      sendTasksToAndroid(newTasks);
      toastMessageToAndroid("할일이 추가되었습니다.")
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    sendTasksToAndroid(newTasks);
    toastMessageToAndroid("할일이 삭제되었습니다.")
  };

  const sendTasksToAndroid = (tasks) => {
    if (window.ANDROID) {
      window.ANDROID.setTasks(JSON.stringify(tasks));
    } else {
      console.log("ANDROID interface not available");
    }
  };

  const toastMessageToAndroid = (message) => {
    if (window.ANDROID) {
      window.ANDROID.showText(message);
    } else {
      console.log("ANDROID interface not available");
    }
  };

  return (
    <div className="app">
      <h1>Simple TO-DO List</h1>
      <div className="task-input">
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="추가할 내용을 작성해주세요." 
        />
        <button onClick={addTask}>할일 추가</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index}>
            {task} 
            <button onClick={() => removeTask(index)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;