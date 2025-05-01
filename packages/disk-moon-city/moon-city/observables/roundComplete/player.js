import { map, of } from 'rxjs';
import { PLAYER_STATUS } from '../../utils/keys.js';

/**
 * @param {import('../../classes/Player.js').default} player
 * @param {import('../../classes/Player.js').default[]} players
 */
export const player = function (player, players) {
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
