import React, { Component } from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import Loader from '../Loader';

const Home = () => (
  <div>
    <h1>Home</h1>
    <Messages />
  </div>
);

const condition = authUser => !!authUser;

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      messages: []
    };
  }
  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages().on('value', snapshot => {
      const messageObject = snapshot.val();
      if (messageObject) {
        const messageList = Object.keys(messageObject).map(key => ({
          ...messageObject[key],
          uid: key,
        }));

        this.setState({
          messages: messageList,
          loading: false
        });
      } else {
        this.setState({ messages: null, loading: false });
      }
    });
  }
  componentWillMount() {
    this.props.firebase.messages().off();
  }

  onChangeText = e => {
    this.setState({ text: e.target.value });
  }

  onCreateMessage = (e, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid
    });
    this.setState({ text: '' });
    e.prevenDefault();
  }

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  render() {

    const { text, messages, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (

          <div>
            {loading && (
              <div style={center}>
                <Loader />
              </div>
            )}
            {messages ? (
              <MessageList 
                messages={messages}
                onRemoveMessage={this.onRemoveMessage}
              />
            ) : (
                <div>There are no messages</div>
              )}

            <form onSubmit={e => this.onCreateMessage(e, authUser)}>
              <input
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const MessageList = ({ messages, onRemoveMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

const MessageItem = ({ message, onRemoveMessage }) => (
  <li>
    <strong>{message.userId} </strong><br/>{message.text}
    <button 
      type="button"
      onClick={() => onRemoveMessage(message.uid)}>Delete</button>
  </li>
);

const Messages = withFirebase(MessagesBase);
const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Home);
