import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Container, List, Header, Avatar, Name, Bio, Stars} from './styles';

import api from '../../services/api';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    repos: [],
    stars: [],
  };

  async componentDidMount() {
    const {navigation} = this.props;

    const user = navigation.getParam('user');

    const [repo, star] = Promise.all(
      await api.get(`/users/${user.login}/repos`),
      await api.get(`/users/${user.login}/starred`)
    );

    this.setState({stars: star.data, repos: repo.data});
  }

  render() {
    const {navigation} = this.props;
    const {stars, repos} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({starItem}) => starItem}
        />
        <List
          data={repos}
          keyExtractor={repo => String(repo.id)}
          renderItem={({item}) => item}
        />
      </Container>
    );
  }
}
