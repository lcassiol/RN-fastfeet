import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { parseISO, format } from 'date-fns';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Spinner from 'react-native-loading-spinner-overlay';

import { signOut } from '~/store/modules/auth/actions';

import api from '~/services/api';

import {
  Container,
  Header,
  Avatar,
  Initial,
  Image,
  ContentHeader,
  ContentHeaderText,
  Welcome,
  Name,
  Logout,
  Content,
  List,
  Heading,
  Title,
  Filters,
  Pending,
  HandedOut,
  TextFilter,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  TimeLine,
  Line,
  Ellipses,
  Ellipse,
  TextLine,
  CardFooter,
  Info,
  Label,
  Text,
  Details,
  DetailText,
  NotRegister,
  TextNotRegister,
  StatusTextContent,
} from './styles';

function Dashboard({ isFocused, navigation }) {
  const [packages, setPackages] = useState([]);
  const [isConcluded, setIsConcluded] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.profile);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();

  async function loadPackages(concluded) {
    setLoading(true);
    console.tron.log('LOADING >>>>>>');
    try {
      const { data } = await api.get(`deliveryman/${userId}/deliveries`, {
        params: {
          finished: concluded,
        },
      });
      let key = 1;

      setPackages(
        data.map((item) => {
          const obj = {
            ...item,
            key: key < 10 ? `0${key}` : key,
            awaitingWithdrawal: !item.start_date,
            delivered: !!item.end_date,
          };
          key += 1;
          return obj;
        })
      );
    } catch (error) {}

    setLoading(false);
  }

  useEffect(() => {
    loadPackages(isConcluded);
  }, [isFocused, isConcluded]);

  useEffect(() => {
    loadPackages(isConcluded);
  }, [isConcluded]);

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Spinner
        visible={loading}
        animation="fade"
        overlayColor="rgba(0,0,0,0.8)"
        textContent="Carregando dados"
        textStyle={{ color: '#fff' }}
      />
      <Header>
        <Avatar>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} />
          ) : (
            <Initial>{user.initials}</Initial>
          )}
        </Avatar>
        <ContentHeader>
          <ContentHeaderText>
            <Welcome>Bem vindo de volta,</Welcome>
            <Name>{user.name}</Name>
          </ContentHeaderText>
          <Logout onPress={handleLogout}>
            <Icon name="exit-to-app" size={25} color="#E74040" />
          </Logout>
        </ContentHeader>
      </Header>
      <Content>
        <Heading>
          <Title>Entregas</Title>
          <Filters>
            <Pending
              active={!isConcluded}
              onPress={() => setIsConcluded(false)}>
              <TextFilter active={!isConcluded}>Pendentes</TextFilter>
            </Pending>
            <HandedOut
              active={isConcluded}
              onPress={() => setIsConcluded(true)}>
              <TextFilter active={isConcluded}>Entregues</TextFilter>
            </HandedOut>
          </Filters>
        </Heading>
        {packages.length === 0 && !loading && (
          <NotRegister>
            <TextNotRegister>Não foram encontrados registros</TextNotRegister>
          </NotRegister>
        )}

        <List
          data={packages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card>
              <CardHeader>
                <Icon name="local-shipping" size={22} color="#7D40E7" />
                <CardTitle>Encomenda {item.key}</CardTitle>
              </CardHeader>
              <CardBody>
                <TimeLine>
                  <Ellipses>
                    <Line />
                    <Ellipse complete />
                    <Ellipse complete={!item.awaitingWithdrawal} />
                    <Ellipse complete={item.delivered} />
                  </Ellipses>
                  <StatusTextContent>
                    <TextLine>Aguardando Retirada</TextLine>
                    <TextLine>Retirada</TextLine>
                    <TextLine>Entregue</TextLine>
                  </StatusTextContent>
                </TimeLine>
              </CardBody>
              <CardFooter>
                <Info>
                  <Label>Data</Label>
                  <Text>{format(parseISO(item.createdAt), 'dd/MM/yyyy')}</Text>
                </Info>
                <Info>
                  <Label>Cidade</Label>
                  <Text>{item.recipient.city}</Text>
                </Info>
                <Info>
                  <Details
                    onPress={() =>
                      navigation.navigate('Detail', { delivery: item })
                    }>
                    <DetailText>Ver detalhes</DetailText>
                  </Details>
                </Info>
              </CardFooter>
            </Card>
          )}
        />
      </Content>
    </Container>
  );
}

export default Dashboard;
