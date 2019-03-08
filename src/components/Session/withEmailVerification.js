import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser => 
    authUser && 
    !authUser.emailVerified && 
    authUser.providerData
        .map(provider => provider.providerId)
        .includes('password');


const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        constructor(props){
            super(props);
            this.state = {isSent: false};
        }

        onSendEmailVerification = () => {
            this.props.firebase
                .doSendEmailVerification()
                .then(()=> this.setState({isSent: true}));
        }

        render() {
            return(
                <AuthUserContext.Consumer>
                    {authUser => 
                        needsEmailVerification(authUser) ? (
                            <div>
                                {this.state.isSent ? (
                                    <p>
                                        Email confirmation sent: Check your emails (Spam folder included) for a confirmation email.
                                        Refresh <strong>this page</strong> once you confirmed your email.
                                    </p>
                                ):(
                                    <p>
                                        Verify yor Email: Check your emails (Spam folder included) for a confirmation email or send another confirmation email.
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={this.onSendEmailVerifiction}
                                    disabled={this.state.isSent}
                                >
                                    Send Confirmation Email
                                </button>
                            </div>
                        ) : (
                            <Component {...this.props} />
                        )
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
