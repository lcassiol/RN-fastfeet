import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';

import api from '~/services/api';
import CustomStatusBar from '~/components/CustomStatusBar';

import {
  Container,
  Background,
  Content,
  Form,
  Input,
  Button,
  Text,
} from './styles';

export default function ReportProblem({ route, navigation }) {
  const { id: deliveryId } = route.params;

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit() {
    setLoading(true);

    try {
      await api.post(`delivery/${deliveryId}/problems`, {
        description,
      });

      setLoading(false);
      setDescription('');
      setAlertMessage('Problema reportado com sucesso!');
    } catch (error) {
      setAlertMessage('Ocorreu um erro, tente novamente em alguns instantes');
      setLoading(false);
    }

    setShowAlert(true);
  }

  return (
    <>
      <CustomStatusBar />
      <Container>
        <Background />
        <Content>
          <Spinner
            visible={loading}
            animation="fade"
            overlayColor="rgba(0,0,0,0.8)"
            textContent="Enviando problema"
            textStyle={{ color: '#fff' }}
          />
          <Form>
            <Input value={description} onChangeText={setDescription} />
            <Button onPress={handleSubmit}>
              <Text>Enviar</Text>
            </Button>
          </Form>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Info"
            message={alertMessage}
            closeOnHardwareBackPress={false}
            showConfirmButton
            confirmText="Ok"
            confirmButtonColor="#7d40e7"
            onConfirmPressed={() => {
              setShowAlert(false);
              navigation.goBack();
            }}
          />
        </Content>
      </Container>
    </>
  );
}

ReportProblem.propTypes = {
  navigation: PropTypes.shape().isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
};

ReportProblem.navigationOptions = ({ navigation }) => ({
  title: 'Informar problema',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
