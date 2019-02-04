import React from 'react';
import {withAuthorization} from '../Session';

const Home = () => (
	<div>
		<h1>Home</h1>
		<p> The homepage is accesible by signed in users only</p>
	</div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
