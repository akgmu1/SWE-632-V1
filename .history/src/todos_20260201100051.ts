export interface Todo {
    id: number;
    description: string;
}

const TODOS: Todo[] = [
    {
        id: 1,
        description: "Task 1"
    },
    {
        id: 2,
        description: "Task 2"
    },
    {
        id: 3,
        description: "Task 3"
    }
]

export function getTodos(): Todo[] {
    return TODOS;
}

export function getTodo(id: number): Todo | undefined {
    return getTodos().find(element => {
        return element.id === id
    });
}

export function todoExists(id: number): boolean {
    return getTodos().find(element => {
        return element.id === id
    }) !== undefined;
}
