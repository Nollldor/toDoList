import React, {FC, memo, useEffect} from 'react'
import {Delete} from '@mui/icons-material'
import {Button, IconButton} from '@mui/material'
import {Task} from './task/Task'
import {
    TodolistDomainType,
    todolistsActions,
    todolistsThunks
} from 'features/todolists-list/todolists/todolists.reducer'
import {tasksThunks} from 'features/todolists-list/tasks/tasks.reducer';
import {TaskStatuses} from 'common/enums';
import {useActions} from 'common/hooks';
import {AddItemForm, EditableSpan} from 'common/components'
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {FilterTasksButtons} from "features/todolists-list/Todolist/filter-tasks-buttons/FilterTasksButtons";

type Props = {
    todolist: TodolistDomainType
    tasks: TaskType[]
}

export const Todolist: FC<Props> = memo(({todolist, tasks}) => {

    const {fetchTasks, addTask} = useActions(tasksThunks)
    const {removeTodolist, changeTodolistTitle} = useActions(todolistsThunks)


    useEffect(() => {
        fetchTasks(todolist.id)
    }, [])

    const addTaskCallback = (title: string) => {
        addTask({title, todolistId: todolist.id})
    }

    const removeTodolistCallback = () => {
        removeTodolist(todolist.id)
    }

    const changeTodolistTitleCallback = (title: string) => {
        changeTodolistTitle({id: todolist.id, title})
    }



    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback}/>
            <IconButton onClick={removeTodolistCallback} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButtons todolist={todolist}/>
        </div>
    </div>
})


