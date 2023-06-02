import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";

import { groupsGetAll } from "./groupsGetAll";

export async function groupRemoveByName(groupDeleted: string) {
  try {

    // DELETAR o grupo

    const storedGroups = await groupsGetAll();;

    const groups = storedGroups.filter(group => group !== groupDeleted);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));

    // DELETAR os player do grupo

    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`);

  } catch (error) {

    throw (error);

  }
}