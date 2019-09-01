import React, {Component} from 'react';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

import {Title} from '../../components/Title';
import {Container} from '../../components/Container';
import {FlatList} from '../../components/FlatList';
import {Header} from '../../components/Header';
import {Bio} from '../../components/Bio';
import {Button} from '../../components/Button';
import {Box} from './styles';

import api from '../../services/api';

export default class Repository extends Component {
  static navigationOptions = {
    title: 'Repositórios',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repos: [],
  };

  async componentDidMount() {
    const {navigation} = this.props;

    const user = navigation.getParam('user');

    const repo = await api.get(`/users/${user.login}/repos`);

    this.setState({
      repos: repo.data,
    });
  }

  render() {
    const {repos} = this.state;

    return (
      <Container>
        <FlatList
          data={repos}
          keyExtractor={repo => String(repo.id)}
          renderItem={({item}) => (
            <Header>
              <Button onPress={() => Linking.openURL(item.html_url)}>
                <Icon name="github" size={60} color="#333" />
              </Button>
              <Box>
                <Title>{item.name}</Title>
                <Bio numberOfLines={2}>{item.description}</Bio>
              </Box>
            </Header>
          )}
        />
      </Container>
    );
  }
}
