import styled from 'styled-components/native';

export const CustomStatusBar = styled.SafeAreaView`
  flex: 0;
  background: #7d40e7;
`;

export const Container = styled.SafeAreaView`
  flex: 1;
  background: #ffffff;
`;

export const Background = styled.View`
  background: #7d40e7;
  height: 140px;
`;

export const Content = styled.View`
  align-items: center;
  top: -70px;
`;

export const Card = styled.View`
  background: #fff;
  padding: 13px 25px 13px 14px;
  width: 335px;
  border-radius: 4px;
  margin-bottom: 9px;
  box-shadow: 0px 1px 1px #0000001a;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CardTitle = styled.Text`
  margin-left: 5px;
  color: #7d40e7;
  font-size: 14px;
  font-weight: bold;
`;

export const CardBody = styled.View`
  margin-top: 5px;
`;

export const Label = styled.Text`
  color: #999999;
  margin-top: ${(props) => (props.firstItem ? 0 : '15px')};
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
`;

export const Text = styled(Label)`
  color: #666666;
  margin-top: 5px;
  text-transform: none;
  font-weight: normal;
`;

export const Actions = styled.View`
  padding: 0 14px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fd;
  width: 335px;
  height: 83px;
  border-radius: 4px;
`;

export const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
`;

export const Separator = styled.View`
  background: #0000001a;
  width: 1px;
  height: 100%;
`;

export const ButtonText = styled.Text`
  text-align: center;
  margin-top: 2px;
  font-size: 12px;
  color: #999999;
`;

export const TwoRows = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
