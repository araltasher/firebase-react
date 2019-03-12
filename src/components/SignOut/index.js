import React from 'react';
import { withFirebase } from '../Firebase';

import './SignOut.scss';

const SignOut = ({ firebase }) => (
  <button className="signout" type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOut);
