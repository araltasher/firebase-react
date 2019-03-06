import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import {PasswordForgetForm} from '../PasswordForget';
import {AuthUserContext, withAuthorization} from '../Session';
import {withFirebase} from '../Firebase';

const SIGN_IN_METHODS = [
	{
		id:'password',
		provider: null,
	},
	{
		id:'google.com',
		provider: 'googleProvider',
	},
	{
		id:'facebook.com',
		provider: 'facebookProvider',
	},
	{
		id:'twitter.com',
		provider: 'twitterProvider',
	},
];

const Account = () => (
	<AuthUserContext.Consumer>
		{authUser => (
		<div>
			<h1>Account: <span>{authUser.email}</span></h1>
			<PasswordForgetForm />
			<PasswordChangeForm />
			<LoginManagement authUser={authUser} />
		</div>
		)}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

class LoginManagementBase extends React.Component {
	constructor(props){
		super(props);
		this.state= {
			activeSignInMethods: [],
			error: null,
		};
	}

	componentDidMount() {
		this.props.firebase.auth
			.fetchSignInMethodsForEmail(this.props.authUser.email)
			.then(activeSignInMethods => this.setState({
				activeSignInMethods,
				error: null
			}),
			).catch(
				error => this.setState({error})
			);
	}

	render() {	
		const {activeSignInMethods, error} = this.state;
	
		return(
			<div>
				Sign In Methods:
					<ul>
						{SIGN_IN_METHODS.map(signInMethod => {
							const isEnabled = activeSignInMethods.includes(signInMethod.id);
							return(
								<li key={signInMethod.id}>
								{isEnabled ? (
									<button type="button" onClick={()=>{}}> Deactivate {signInMethod.id}</button>
								) : (
									<button type="button" onClick={()=>{}}> Activate {signInMethod.id}</button>
								)}
								</li>
							);
						})}
					</ul>
					{error && error.message}
			</div>
		);
	}
}

const LoginManagement = withFirebase(LoginManagementBase);

export default withAuthorization(condition)(Account);
