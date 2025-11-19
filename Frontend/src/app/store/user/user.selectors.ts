import { createFeatureSelector ,createSelector } from "@ngrx/store";
import { UserState } from "../../models/user.model";

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectLoggedUser = createSelector(
    selectUserState,
    (state: UserState) => state.loggedUser
);

export const selectAllUsers = createSelector(
    selectUserState,
    (state: UserState) => state.users
);