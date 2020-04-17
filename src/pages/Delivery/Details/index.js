import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AwesomeAlert from 'react-native-awesome-alerts';
import api from '~/services/api';
import CustomStatusBar from '~/components/CustomStatusBar';

import {
  Container,
  Background,
  Content,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Label,
  Text,
  Actions,
  Button,
  Separator,
  ButtonText,
  TwoRows,
} from './styles';

export default function Detail({ route, navigation }) {
  const { delivery: deliveryItem } = route.params;

  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState(deliveryItem);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const userId = useSelector((state) => state.auth.id);

  const withdrawalDate = useMemo(
    () =>
      delivery.start_date
        ? format(parseISO(delivery.start_date), 'dd / MM / yyyy')
        : '- - / - - / - -',
    [delivery.start_date]
  );

  const deliveryDate = useMemo(
    () =>
      delivery.end_date
        ? format(parseISO(delivery.end_date), 'dd / MM / yyyy')
        : '- - / - - / - -',
    [delivery.end_date]
  );

  const status = useMemo(() => {
    if (delivery.end_date) {
      return 'Concluído';
    }

    if (delivery.canceled_at) {
      return 'Cancelado';
    }

    return 'Pendente';
  }, [delivery.end_date, delivery.canceled_at]);

  async function takeDelivery() {
    setLoading(true);

    try {
      const { data } = await api.put(
        `/deliveryman/${userId}/delivery/${delivery.id}`,
        {
          start_date: new Date(),
        }
      );

      setDelivery(data);
      setAlertMessage('Encomenda retirada com sucesso!');
    } catch (error) {
      setAlertMessage(
        'Erro ao realizar retirada tente novamente em alguns minutos'
      );
      console.tron.log(error);
    }
    setShowAlert(true);
    setLoading(false);
  }

  function DeliveryActions() {
    if (!delivery.end_date) {
      if (!delivery.start_date) {
        return (
          <Actions single>
            {loading ? (
              <ActivityIndicator size="large" color="#7D40E7" />
            ) : (
              <Button single onPress={takeDelivery}>
                <Icon name="truck" size={25} color="#7D40E7" />
                <ButtonText>Realizar retirada</ButtonText>
              </Button>
            )}
          </Actions>
        );
      }

      return (
        <Actions>
          <Button
            onPress={() =>
              navigation.navigate('ReportProblem', { id: delivery.id })
            }>
            <Icon name="close-circle-outline" size={25} color="#E74040" />
            <ButtonText>Informar Problema</ButtonText>
          </Button>
          <Separator />
          <Button
            onPress={() =>
              navigation.navigate('ListProblems', {
                id: delivery.id,
              })
            }>
            <Icon name="information-outline" size={25} color="#E7BA40" />
            <ButtonText>Visualizar Problemas</ButtonText>
          </Button>
          <Separator />
          <Button
            onPress={() => navigation.navigate('Confirm', { id: delivery.id })}>
            <Icon name="check-circle-outline" size={25} color="#7D40E7" />
            <ButtonText>Confirmar Entrega</ButtonText>
          </Button>
        </Actions>
      );
    }

    return <View />;
  }

  return (
    <>
      <CustomStatusBar />
      <Container>
        <StatusBar barStyle="light-content" />
        <Background />
        <Content>
          <Card>
            <CardHeader>
              <Icon name="truck" size={22} color="#7D40E7" />
              <CardTitle>Informações da entrega</CardTitle>
            </CardHeader>
            <CardBody>
              <Label firstItem>Destinatário</Label>
              <Text>{delivery.recipient.name}</Text>

              <Label>Endereço de entrega</Label>
              <Text>
                {delivery.recipient.street}, {delivery.recipient.number},{' '}
                {delivery.recipient.city} - {delivery.recipient.state},{' '}
                {delivery.recipient.postal_code}
              </Text>

              <Label>Produto</Label>
              <Text>{delivery.product}</Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Icon name="calendar" size={22} color="#7D40E7" />
              <CardTitle>Situação da entrega</CardTitle>
            </CardHeader>
            <CardBody>
              <Label firstItem>Status</Label>
              <Text>{status}</Text>

              <TwoRows>
                <View>
                  <Label>Data de retirada</Label>
                  <Text>{withdrawalDate}</Text>
                </View>

                <View>
                  <Label>Data de entrega</Label>
                  <Text>{deliveryDate}</Text>
                </View>
              </TwoRows>
            </CardBody>
          </Card>

          <DeliveryActions />
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
            }}
          />
        </Content>
      </Container>
    </>
  );
}

Detail.propTypes = {
  navigation: PropTypes.shape().isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
  delivery: PropTypes.shape(),
};

Detail.defaultProps = {
  delivery: {},
};

Detail.navigationOptions = ({ navigation }) => ({
  title: 'Detalhes da encomenda',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
