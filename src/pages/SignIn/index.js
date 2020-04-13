import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image, ActivityIndicator } from 'react-native';

import { Container, Form, Input, Button, Text } from './styles';

import { signInRequest } from '~/store/modules/auth/actions';
import logo from '~/assets/logo.png';

export default function SignIn() {
  const [id, setId] = useState('');
  const loading = useSelector((state) => state.auth.loading);

  const dispatch = useDispatch();

  function handleSubmit(value) {
    dispatch(signInRequest(value));
  }

  return (
    <Container>
      <Image source={logo} />
      <Form>
        <Input placeholder="Informe seu ID de cadastro" onChangeText={setId} />

        <Button onPress={() => handleSubmit(id)}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text>Entrar no sistema</Text>
          )}
        </Button>
      </Form>
    </Container>
  );
}
