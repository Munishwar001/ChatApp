import { createReducer ,on } from "@ngrx/store";
import * as UserActions from "./user.actions";
import { initialState, User } from "../../models/user.model";

export const userReducer = createReducer(
    initialState,
    on(UserActions.loadUsers, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(UserActions.loadUsersSuccess, (state, { loggedUser, users }) => ({
        ...state,
        loggedUser: loggedUser, 
        users: users,
        loading: false,
        error: null
    })),

    on(UserActions.LoadUsersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    }))
);