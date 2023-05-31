import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";

import { Input } from "@components/Input";
import { Header } from "@components/Header";
import { Button } from "@components/Button";
import { Filter } from "@components/Filter";
import { Loading } from "@components/Loading";
import { ListEmpty } from "@components/ListEmpty";
import { Highlight } from "@components/Highlight";
import { PlayerCard } from "@components/PlayerCard";
import { ButtonIcon } from "@components/ButtonIcon";

import { AppError } from '../../utils/AppError';

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

type RouteParams = {
  group: string;
}

export function Players() {

  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();

  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team: team,
    }

    try {

      await playerAddByGroup(newPlayer, group);

      // Tira o foco do input
      newPlayerNameInputRef.current?.blur();

      // Fecha o teclado
      Keyboard.dismiss();

      setNewPlayerName('');

      fetchPlayersByTeam();
      
    } catch (error) {

      if(error instanceof AppError) {
        Alert.alert('Nova Pessoa', error.message);
      } else {
        Alert.alert('Nova Pessoa', 'Não foi possivel adicionar.');
      }

    }
  }

  async function fetchPlayersByTeam() {
    try {

      setIsLoading(true);
      
      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      setPlayers(playersByTeam);

    } catch (error) {
    
      Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas do time selecionado');
      
    } finally {

      setIsLoading(false);
      
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {

      await playerRemoveByGroup(playerName, group);

      fetchPlayersByTeam();
      
    } catch (error) {
      Alert.alert('Remover Pessoa', 'Não foi possivel remover essa pessoa.');
    }
  }

  async function groupRemove() {
    try {

      await groupRemoveByName(group);

      navigation.navigate('groups');
      
    } catch (error) {
      
      Alert.alert('Remover Grupo', 'Não foi possivel remover o grupo.');

    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove }
      ]
    )
  }

  useEffect(() => {

    fetchPlayersByTeam();

  },[team]);

  return (
    <Container>

      <Header showBackButton />

      <Highlight
        title={group}
        subtitle='Adiciona a galera e separe os times'
      />

      <Form>

        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder='Nome da pessoa'
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer} //Ativado quando o usuario usa o ENTER do teclado
          returnKeyType='done' // Tecla que deve ser clicada
        />

        <ButtonIcon
          icon='add'
          onPress={handleAddPlayer}
        />

      </Form>

      <HeaderList >

        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>

      </HeaderList>

      {
        isLoading ? <Loading /> : 

        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message='Não há pessoas nesse time.'
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />

      }

      <Button
        title='Remover turma'
        type='SECONDARY'
        onPress={handleGroupRemove}
      />

    </Container>
  );
}