import { Alert } from 'react-native';

import { parseISO, format } from 'date-fns';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';

import { signInSuccess, signInFailure } from './actions';

export function* singIn({ payload }) {
  try {
    const { id } = payload;

    const response = yield call(api.get, `deliveryman/${id}`);

    yield put(
      signInSuccess(id, {
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar?.url,
        initials: response.data.name
          .split(' ')
          .map((n) => n[0])
          .join(''),
        createdAt: format(parseISO(response.data.created_at), 'dd/MM/yyyy'),
      })
    );
  } catch (err) {
    Alert.alert('Falha na autenticação', 'Verifique sua identificação');
    yield put(signInFailure());
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', singIn)]);
