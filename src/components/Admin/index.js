import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import Loader from '../Loader';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const Admin = () => (
  <div>
    <h1>Admin</h1>
    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>
);

class UserListBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const userList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: userList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;
    const listStyle = {
      marginBottom: '2rem',
    };

    return (
      <div>
        <h2>
          Users
       </h2>
        {loading && (
          <div style={center}>
            <Loader />
          </div>
        )}
        <ul>
          {users.map(user => (
            <li style={listStyle} key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <br />
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <br />
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <br />
              <span>
                <Link to={{pathname:`${ROUTES.ADMIN}/${user.uid}`, state: {user}}}>
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class UserItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
  }

  componentDidMount() {

    if(this.state.user){
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  }

  render() {
    const { user, loading } = this.state;
    return (
      <div>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && (
          <div style={center}>
            <Loader />
          </div>
        )}

        {user && (
          <div>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <br />
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <br />
            <span>
              <strong>Full Name:</strong> {user.username}
            </span> <br/>
            <span>
              <button type="button" onClick={this.onSendPasswordResetEmail}>
              Send Password Reset</button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);
const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase
)(Admin);
