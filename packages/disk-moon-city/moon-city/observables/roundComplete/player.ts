import { map, of } from 'rxjs';
import { PLAYER_STATUS } from '../../types';
import type Player from '../../classes/Player';

export const player = function (player: Player, players: Player[]) {
  return of(player).pipe(
    map(player => {
      player.checkStatus();

      const playersDestroyed =
        players
          .filter(({ id }) => id !== player.id)
          .filter(player => player.status !== PLAYER_STATUS.GAME_LOST)
          .length === 0;

      if (playersDestroyed) {
        player.status = PLAYER_STATUS.GAME_WON;
      }
      return player;
    })
  );
};
