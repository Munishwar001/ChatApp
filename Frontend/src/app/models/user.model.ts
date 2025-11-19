
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserState {
  loggedUser: any;
  users: User[];
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
    loggedUser: null,
  users: [],
  loading: false,
  error: null
};