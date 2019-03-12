import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';

const Home = () => (
  <div>
    <h1>Home</h1>
    <p> The homepage is accesible by signed in users only</p>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Home);
