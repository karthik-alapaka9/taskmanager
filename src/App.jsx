
import { useState, useEffect } from 'react'
import './App.css'

// Render Backend URL
const API_URL = 'https://taskmanager-backend-3a16.onrender.com/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  // Step 1: Backend nundi tasks fetch cheyyadam
  async function fetchTasks() {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data)

    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  // Step 2: Website open ayinappudu tasks load cheyyadam
  useEffect(() => {
    fetchTasks()
  }, [])

  // Step 3: New task add cheyyadam
  async function addTask(event) {
    event.preventDefault()

    if (title.trim() === '') {
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const savedTask = await response.json()

      setTasks(currentTasks => [...currentTasks, savedTask])
      setTitle('')

    } catch (error) {
      console.error('Error adding task:', error)
      alert('Task save avvaledu. Backend check cheyyi.')
    }
  }

  // Step 4: Task completed status update cheyyadam
  async function toggleTask(id) {
    const task = tasks.find(task => task.id === id)

    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !task.completed
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()

      setTasks(currentTasks =>
        currentTasks.map(item =>
          item.id === id ? updatedTask : item
        )
      )

    } catch (error) {
      console.error('Error updating task:', error)
      alert('Task status update avvaledu.')
    }
  }

  // Step 5: Task delete cheyyadam
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(currentTasks =>
        currentTasks.filter(task => task.id !== id)
      )

    } catch (error) {
      console.error('Error deleting task:', error)
      alert('Task delete avvaledu.')
    }
  }

  // Step 6: Website UI
  return (
    <div className="app">
      <div className="task-container">

        <h1>Task Manager</h1>

        <p className="subtitle">
          Organize your day, one task at a time.
        </p>

        <form onSubmit={addTask} className="task-form">

          <input
            type="text"
            placeholder="Enter a new task..."
            value={title}
            onChange={event => setTitle(event.target.value)}
          />

          <button type="submit">
            Add Task
          </button>

        </form>

        <h2>My Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="empty">
            No tasks yet. Add your first task!
          </p>
        ) : (
          <ul className="task-list">

            {tasks.map(task => (
              <li key={task.id} className="task-item">

                <label className={task.completed ? 'completed' : ''}>

                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  {task.title}

                </label>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </li>
            ))}

          </ul>
        )}

      </div>
    </div>
  )
}

export default App
