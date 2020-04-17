import React, { useState, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import AwesomeAlert from 'react-native-awesome-alerts';
import CustomStatusBar from '~/components/CustomStatusBar';

import api from '~/services/api';
import DefaultImage from '~/assets/defaultPackage.png';

import {
  Container,
  Background,
  Content,
  CaptureImage,
  Image,
  Camera,
  Actions,
  ButtonCamera,
  Button,
  Text,
} from './styles';

export default function Confirm({ route, navigation }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [takeImage, setTakeImage] = useState('');
  const [dataImage, setDataImage] = useState({});
  const [loading, setLoading] = useState(false);

  const idUser = useSelector((state) => state.auth.id);
  const { id: deliveryId } = route.params;

  const camera = useRef(null);

  async function takePicture() {
    const photo = await camera.current.takePictureAsync({
      quality: 0.5,
      base64: true,
    });

    setTakeImage(photo.uri);
    setDataImage(photo);
    setShowCamera(false);
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', {
        uri: dataImage.uri,
        name: 'signature.jpg',
        originalname: 'signature.jpg',
        type: 'image/jpeg',
      });
      const response = await api.post('/files', data);

      await api.put(`deliveryman/${idUser}/delivery/${deliveryId}`, {
        signature_id: response.data.id,
        end_date: new Date(),
      });

      setAlertMessage('Entrega finalizada');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage(
        'Ocorreu um erro na entrega, tente novamente em alguns instantes.'
      );
      setShowAlert(true);
    }

    setLoading(false);
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
            textContent="Concluindo entrega"
            textStyle={{ color: '#fff' }}
          />
          {showCamera ? (
            <CaptureImage>
              <Camera
                ref={camera}
                type={Camera.Constants.Type.back}
                autoFocus={Camera.Constants.AutoFocus.on}
                flashMode={Camera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permissão para usar a camera',
                  message: 'Precisamos de sua permissão para abrir a camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancelar',
                }}
              />

              <Actions isCamera={showCamera}>
                <ButtonCamera onPress={() => takePicture()}>
                  <Icon name="camera" size={25} color="#fff" />
                </ButtonCamera>
              </Actions>
            </CaptureImage>
          ) : (
            <>
              <Image source={takeImage ? { uri: takeImage } : DefaultImage}>
                <Actions>
                  <ButtonCamera onPress={() => setShowCamera(true)}>
                    <Icon name="camera" size={25} color="#fff" />
                  </ButtonCamera>
                </Actions>
              </Image>
              <Button disabled={!takeImage} onPress={handleSubmit}>
                <Text>Enviar</Text>
              </Button>
            </>
          )}
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
              navigation.navigate('Dashboard');
            }}
          />
        </Content>
      </Container>
    </>
  );
}

Confirm.propTypes = {
  navigation: PropTypes.shape().isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape(),
  }).isRequired,
};

Confirm.navigationOptions = ({ navigation }) => ({
  title: 'Confirmar entrega',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
