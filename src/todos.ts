export interface Todo {
  id: number
  description: string
  completed: boolean
}

let TODOS: Todo[] = [
  {
    id: 1,
    description: 'Task 1',
    completed: false,
  },
  {
    id: 2,
    description: 'Task 2',
    completed: false,
  },
  {
    id: 3,
    description: 'Task 3',
    completed: false,
  },
]

export function getTodos(): Todo[] {
  return TODOS
}

export function getTodo(id: number): Todo | undefined {
  return getTodos().find((element) => {
    return element.id === id
  })
}

export function todoExists(id: number): boolean {
  return (
    getTodos().find((element) => {
      return element.id === id
    }) !== undefined
  )
}

export function addTodo(description: string): Todo {
  const newTodo: Todo = {
    id: Date.now(),
    description,
    completed: false,
  }

  TODOS.push(newTodo)
  return newTodo
}

export function removeTodo(id: number) {
  TODOS = TODOS.filter((e) => e.id !== id)
}
