import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { parseISO, format } from 'date-fns';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';

import { signOut } from '~/store/modules/auth/actions';
import EmptyResult from '~/components/EmptyResult';
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
  StatusTextContent,
} from './styles';

function Dashboard({ navigation }) {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();
  const [packages, setPackages] = useState([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.profile);
  const userId = useSelector((state) => state.auth.id);

  async function loadDeliveries() {
    if (!isFocused) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.get(`deliveryman/${userId}/deliveries`, {
        params: {
          finished,
        },
      });

      setPackages(
        data.map((item) => {
          const obj = {
            ...item,
            createdAt: format(parseISO(item.createdAt), 'dd/MM/yyyy'),
            key: item.id < 10 ? `0${item.id}` : item.id,
            withdrawn: !!item.start_date,
            delivered: !!item.end_date,
          };

          return obj;
        })
      );
    } catch (error) {
      console.tron.log('Erro!!');
      console.tron.log(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDeliveries();
  }, [isFocused, finished]);

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Spinner
        visible={loading}
        animation="fade"
        overlayColor="rgba(0,0,0,0.6)"
        textContent="Carregando..."
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
            <Pending active={!finished} onPress={() => setFinished(false)}>
              <TextFilter active={!finished}>Pendentes</TextFilter>
            </Pending>
            <HandedOut active={finished} onPress={() => setFinished(true)}>
              <TextFilter active={finished}>Entregues</TextFilter>
            </HandedOut>
          </Filters>
        </Heading>
        {packages.length === 0 && !loading && (
          <EmptyResult text="Não foram encontrados registros" />
        )}

        <List
          data={packages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card>
              <CardHeader>
                <Icon name="truck" size={22} color="#7D40E7" />
                <CardTitle>Encomenda {item.key}</CardTitle>
              </CardHeader>
              <CardBody>
                <TimeLine>
                  <Ellipses>
                    <Line />
                    <Ellipse complete />
                    <Ellipse complete={item.withdrawn} />
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
                  <Text>{item.createdAt}</Text>
                </Info>
                <Info>
                  <Label>Cidade</Label>
                  <Text>{item.recipient.city}</Text>
                </Info>
                <Info>
                  <Details
                    onPress={() =>
                      navigation.navigate('Details', {
                        delivery: item,
                      })
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

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Dashboard;
