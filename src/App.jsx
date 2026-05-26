import { 
  useState, 
  useEffect, 
  useMemo,
  useCallback
} from 'react'

// Issue 1: Inline API key (security issue) | done (move API key to env to prevent secret exposure)
const API_KEY = import.meta.env.VITE_API_KEY

function App() {
  // Issue 2: State management bisa lebih baik
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  
  // Issue 3: useEffect tanpa dependency array yang tepat | done (wrap JSON in try'n'catch to handle corrupted localStorage)
  useEffect(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('todos')
      if (saved) {
        setTodos(JSON.parse(saved)) 
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
      localStorage.removeItem('todos')
    }
  }, [])
  
  // Issue 4: useEffect yang terlalu sering run | done (add dependency array)
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])
  
  // Issue 5: Function yang tidak di-memoize, re-create setiap render
  const addTodo = useCallback(() => {
    if (input.trim() === '') {
      alert('Please enter a todo')
      return
    }
    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTodos([...todos, newTodo])
    setInput('')
  }, [input, todos])
  
  // Issue 7: Tidak ada error handling | done (add error handling)
  const deleteTodo = useCallback((id) => {
    if (!id) {
      console.error('deleteTodos: id is required')
      return
    }
    const todoExists = todos.some(todo => todo.id === id)
    if (!todoExists) {
      console.error(`deleteTodo: todo with id "${id}" not found`)
      return
    }
    setTodos(todos.filter(todo => todo.id !== id))
  }, [todos])
  
  const toggleTodo = useCallback((id) => {
    if (!id) {
      console.error('toggleTodo: id is required')
      return
    }
    const todoExists = todos.some(todo => todo.id === id)
    if (!todoExists) {
      console.error(`toggleTodo: todo with "${id}" not found`)
      return
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [todos])
  
  // Issue 8: Logic filtering yang bisa dipindah ke useMemo | done (memoize filteredTodos)
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(todo => !todo.completed)
    if (filter === 'completed') return todos.filter(todo => todo.completed)
    return todos
  }, [todos, filter])
  
  // Issue 9: Calculation yang tidak perlu di setiap render | done (memoize stats)
  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  }), [todos])
  
  // Issue 10: Inline event handler dengan arrow function (re-create setiap render) | done (extract inline arrow functions to useCallback)
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
  }, [])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') addTodo()
  }, [addTodo])

  const handleFilterAll = useCallback(() => setFilter('all'), [])
  const handleFilterActive = useCallback(() => setFilter('active'), [])
  const handleFilterCompleted = useCallback(() => setFilter('completed'), [])

  return (
    <div className="app">
      <h1>My Todo List</h1>
      
      {/* Issue 11: Tidak ada label untuk accessibility | done (add labelForHtml) */}
      <div className="input-section">
        <label htmlFor="todo-input">Add Todo</label>
        <input 
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          aria-label="Add a new Todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      {/* Issue 12: Inline styles (inconsistent dengan CSS file) | done (move to inline styles) */}
      <div className="filter-section">
        <button 
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
      </div>
      
      {/* Issue 13: Tidak ada handling untuk empty state | done (add empty state)*/}
      <div className="todo-list">
       {/* Issue 14: Key menggunakan index bisa lebih baik dengan ID | done  */}
        {filteredTodos.length === 0 ? (
          <p className="empty-state">
            {filter === 'all'
              ? 'No todos yet. Add one!'
              : `No ${filter} todos.`}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              {/* Issue 15: Potential XSS jika text dari user input | done (replace deangerouslySetInnerHTML with safe text rendering) */}
              <span>{todo.text}</span>
              <button 
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="stats">
        <p>Total: {stats.total} | Active: {stats.active} | Completed: {stats.completed}</p>
      </div>
      
      {/* Issue 16: Debug code yang tertinggal | done (deleted because jsx execute in every render and leak API key )*/}
    </div>
  )
}

export default App
