import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {FilterValuesType, todolistsActions, todolistsThunks} from 'features/todolists-list/todolists/todolists.reducer'
import {Grid, Paper} from '@mui/material'
import {AddItemForm} from 'common/components'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useActions} from 'common/hooks';
import {selectIsLoggedIn} from 'features/auth/auth.selectors';
import {selectTasks} from 'features/todolists-list/tasks/tasks.selectors';
import {selectTodolists} from 'features/todolists-list/todolists/todolists.selectors';


export const TodolistsList = () => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {addTodolist: addTodolistThunk, fetchTodolists} = useActions(todolistsThunks)

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolists({})
    }, [])


    const addTodolist = (title: string) => {
        return addTodolistThunk(title).unwrap()
    }

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
