import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { withAuthentication } from '../Session';
import Nav from '../Navigation';
import LandingPage from '../Landing';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import PasswordForget from '../PasswordForget';
import Home from '../Home';
import Account from '../Account';
import Admin from '../Admin';

import * as ROUTES from '../../constants/routes';

const App = () =>(
			<Router>
				<>
					<Nav />
					<div className="wrapper">
						<Route exact path={ROUTES.LANDING} component ={LandingPage} />
						<Route exact path={ROUTES.SIGN_UP} component ={SignUp} />
						<Route exact path={ROUTES.SIGN_IN} component ={SignIn} />
						<Route exact path={ROUTES.PASSWORD_FORGET} component ={PasswordForget} />
						<Route exact path={ROUTES.HOME} component ={Home} />
						<Route exact path={ROUTES.ACCOUNT} component ={Account} />
						<Route exact path={ROUTES.ADMIN} component ={Admin} />
					</div>
				</>
			</Router>
		);

export default withAuthentication(App);
