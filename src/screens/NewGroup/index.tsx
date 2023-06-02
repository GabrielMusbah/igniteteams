import { useState } from 'react';
import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Input } from '@components/Input';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Highlight } from '@components/Highlight';

import { groupCreate } from '@storage/group/groupCreate';

import { AppError } from '../../utils/AppError';

import { Container, Content, Icon } from './styles';

export function NewGroup() {

  const [group, setGroup] = useState('');

  const navigation = useNavigation();

  async function handleNew() {
    try {

      if(group.trim().length === 0) {
        return Alert.alert('Novo Grupo', 'Informe o nome da turma.');
      }

      await groupCreate(group);

      navigation.navigate('players', { group });

    } catch (error) {

      if (error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message);
      } else {
        Alert.alert('Novo Grupo', 'Não foi possivel criar um novo grupo.');

        console.log(error);
      }
      
    }
  }

  return (
    <Container>
      
      <Header showBackButton />

      <Content>

        <Icon />

        <Highlight 
          title='Nova turma'
          subtitle='crie a turma para adionar as pessoas'
        />

        <Input
          placeholder='Nome da turma'
          onChangeText={setGroup}
          value={group}
        />

        <Button
          title='Criar'
          style={{marginTop: 20}}
          onPress={handleNew}
        />

      </Content>

    </Container>
  );
}