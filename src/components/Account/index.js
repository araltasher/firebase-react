import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import {PasswordForgetForm} from '../PasswordForget';
import {AuthUserContext, withAuthorization} from '../Session';

const Account = () => (
	<AuthUserContext.Consumer>
		{authUser => (
		<div>
			<h1>Account: <span>{authUser.email}</span></h1>
			<PasswordForgetForm />
			<PasswordChangeForm />
		</div>
		)}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
