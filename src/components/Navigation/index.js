import React from 'react';
import {Link} from 'react-router-dom';
import {AuthUserContext} from '../Session';
import SignOut from '../SignOut';
import './Navigation.scss';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
	<div className="Navigation">
		<AuthUserContext.Consumer>
			{authUser => authUser ? <NavigationAuth/> : <NavigationNonAuth/>}
		</AuthUserContext.Consumer>
	</div>
);

const NavigationAuth = () =>(
<ul>
			<li>
				<Link to={ROUTES.SIGN_IN}>Sign In</Link>
			</li>
			<li>
				<Link to={ROUTES.LANDING}>Landing</Link>
			</li>
			<li>
				<Link to={ROUTES.HOME}>Home</Link>
			</li>
			<li>
				<Link to={ROUTES.ACCOUNT}>Account</Link>
			</li>
			{/* <li>
				<Link to={ROUTES.ADMIN}>Admin</Link>
			</li> */}
			<li>
				<SignOut />
			</li>
		</ul>
);


const NavigationNonAuth = () =>(
	<ul>
				<li>
					<Link to={ROUTES.LANDING}>Landing</Link>
				</li>
				<li>
					<Link to={ROUTES.SIGN_IN}>Sign In</Link>
				</li>
			</ul>
	);

export default Navigation;