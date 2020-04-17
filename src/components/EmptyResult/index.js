import React from 'react';
import PropTypes from 'prop-types';
import { Container, TextInfo } from './styles';

export default function EmptyResult({ text }) {
  return (
    <Container>
      <TextInfo>{text}</TextInfo>
    </Container>
  );
}

EmptyResult.propTypes = {
  text: PropTypes.string(),
};

EmptyResult.defaultProps = {
  text: 'Não foram encontrados registros',
};
