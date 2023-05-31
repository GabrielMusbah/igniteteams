import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { playersGetByGroup } from "./playersGetByGroups";

export async function playersGetByGroupAndTeam(group: string, team: string): Promise<PlayerStorageDTO[]> {
  try {

    const storage = await playersGetByGroup(group);

    const players = storage.filter(player => player.team === team);

    return players;

  } catch (error) {
    
    throw (error);

  }
}