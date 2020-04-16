import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import api from '~/services/api';
import CustomStatusBar from '~/components/CustomStatusBar';

import {
  Container,
  Background,
  Content,
  Title,
  Problem,
  Description,
  Date,
  NotRegister,
  TextNotRegister,
  ProblemList,
} from './styles';

export default function ListProblems({ route }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id: deliveryId } = route.params;

  useEffect(() => {
    async function loadProblems() {
      setLoading(true);
      console.tron.log('CARREGANDOOOOO');
      try {
        const { data } = await api.get(`delivery/${deliveryId}/problems`);
        setProblems(data);
      } catch (error) {
        console.tron.log(error);
      }

      setLoading(false);
    }

    loadProblems();
  }, []);

  return (
    <>
      <CustomStatusBar />
      <Container>
        <Background />
        <Content>
          <Title>Encomenda {deliveryId}</Title>
          <Spinner
            visible={loading}
            animation="fade"
            overlayColor="rgba(0,0,0,0.8)"
            textContent="Carregando problemas"
            textStyle={{ color: '#fff' }}
          />
          {problems.length < 1 && !loading && (
            <NotRegister>
              <TextNotRegister>
                Nenhum registro de problema encontrado
              </TextNotRegister>
            </NotRegister>
          )}
          <ProblemList
            data={problems}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Problem key={item.id}>
                <Description>{item.description}</Description>
                <Date>{format(parseISO(item.createdAt), 'dd/MM/yyyy')}</Date>
              </Problem>
            )}
          />
        </Content>
      </Container>
    </>
  );
}

ListProblems.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
};

ListProblems.navigationOptions = ({ navigation }) => ({
  title: 'Visualizar problemas',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
