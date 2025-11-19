import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChatApi } from '../../services/chat-api';
import * as UserActions from './user.actions';
import { mergeMap, map, catchError, of ,tap } from 'rxjs';

export class UserEffects {

  private actions$ = inject(Actions);
  private chatService = inject(ChatApi);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.chatService.getUsers().pipe(
        tap(response => {
          console.log("Effect API Response:", response);
        }),
          map((response: any) =>
            UserActions.loadUsersSuccess({
              loggedUser: response.loggedUser,
              users: response.users
            })
          ),
          catchError(error =>
            of(UserActions.LoadUsersFailure({ error }))
          )
        )
      )
    )
  );
}
