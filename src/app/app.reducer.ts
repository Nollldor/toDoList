import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type AppInitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
    //adMatcher работает с состояниями action , удобен для работы с крутилками и обработкой ошибок в одном месте
    extraReducers: builder => {
        builder
            .addMatcher(
                (action) => {
                    return action.type.endsWith('/pending')
                },
                (state, action) => {
                    state.status = 'loading'
                })
            .addMatcher(
                (action) => {
                    return action.type.endsWith('/fulfilled')
                },
                (state, action) => {
                    state.status = 'succeeded'
                })
            .addMatcher(action => action.type.endsWith('/rejected'),
                (state, action) => {
                    const { payload, error } = action
                    if (payload) {
                        if (payload.showGlobalError) {
                            state.error = payload.data.messages.length ? payload.data.messages[0] : 'Some error occurred'
                        }
                    } else {
                        state.error = error.message ? error.message : 'Some error occurred'
                    }
                    state.status = 'failed'
                }
            )
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
