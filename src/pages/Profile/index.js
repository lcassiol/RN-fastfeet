import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { signOut } from '~/store/modules/auth/actions';

import {
  Container,
  Avatar,
  Initial,
  Image,
  Content,
  Label,
  Text,
  Logout,
  TextButton,
} from './styles';

export default function Profile() {
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Avatar>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} />
        ) : (
          <Initial>{user.initials}</Initial>
        )}
      </Avatar>
      <Content>
        <Label>Nome completo</Label>
        <Text>{user.name}</Text>

        <Label>Email</Label>
        <Text>{user.email}</Text>

        <Label>Data de cadastro</Label>
        <Text>{user.createdAt}</Text>

        <Logout onPress={handleLogout}>
          <TextButton>Logout</TextButton>
        </Logout>
      </Content>
    </Container>
  );
}
