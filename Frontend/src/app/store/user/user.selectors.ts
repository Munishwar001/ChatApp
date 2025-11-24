import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../../models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectLoggedUser = createSelector(
  selectUserState,
  (state: UserState) => state.loggedUser
);

export const selectAllUsers = createSelector(selectUserState, (state: UserState) => state.users);

export const selectAllChats = createSelector(selectAllUsers, (users) =>
  users.map((u: any) => ({
    id: u.id,
    name: u.fullName,
    lastMessage: u.lastMessage ?? 'hi how are you ',
    unreadCount: u.unreadCount ?? 0,
    isFavorite: u.isFavorite ?? false,
    type: 'individual' as const,

    avatar: u.photoUrl || './default.jpg',
    timestamp: u.lastMessageTime ?? '2 hours ago',
    isOnline: u.isOnline ?? false,
    isArchived: u.isArchived ?? false,
  }))
);
