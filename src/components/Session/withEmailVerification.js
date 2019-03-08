import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        redner() {
            return(
                <AuthUserContext.Consumer>
                    {authUser => <Component {...this.props} />}
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
