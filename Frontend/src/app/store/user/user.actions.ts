import { createAction ,props} from "@ngrx/store";
import { User } from "../../models/user.model";

export const loadUsers = createAction('[User] Load Users');

export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ loggedUser: any; users: any[] }>()
);

export const LoadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);