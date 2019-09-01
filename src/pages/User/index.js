import React, {Component} from 'react';
import {Linking} from 'react-native';
import PropTypes from 'prop-types';

import {Container} from '../../components/Container';
import {Header} from '../../components/Header';
import {Bio} from '../../components/Bio';
import {Button} from '../../components/Button';
import {Avatar} from '../../components/Avatar';
import {Name} from '../../components/Name';
import {FlatList} from '../../components/FlatList';

import {Context} from './styles';

import api from '../../services/api';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
  };

  async componentDidMount() {
    const {navigation} = this.props;

    const user = navigation.getParam('user');

    const star = await api.get(`/users/${user.login}/starred`);

    this.setState({stars: star.data});
  }

  handleNavigate = user => {
    const {navigation} = this.props;

    navigation.navigate('Repository', {user});
  };

  render() {
    const {navigation} = this.props;
    const {stars} = this.state;

    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Button onPress={() => this.handleNavigate(user)}>
            <Avatar source={{uri: user.avatar}} />
          </Button>
          <Context>
            <Name>{user.name}</Name>
            <Bio>{user.bio}</Bio>
          </Context>
        </Header>
        <FlatList
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Header>
              <Button onPress={() => Linking.openURL(item.owner.html_url)}>
                <Avatar source={{uri: item.owner.avatar_url}} />
              </Button>
              <Context>
                <Name>{item.name}</Name>
                <Bio>{item.description}</Bio>
              </Context>
            </Header>
          )}
        />
      </Container>
    );
  }
}
