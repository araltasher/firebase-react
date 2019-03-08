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
	{
		id:'github.com',
		provider: 'githubProvider',
	},
];
const condition = authUser => !!authUser;

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

class LoginManagementBase extends React.Component {
	constructor(props){
		super(props);
		this.state= {
			activeSignInMethods: [],
			error: null,
		};
	}

	componentDidMount() {
		this.fetchSignInMethods();	
	};
	
	fetchSignInMethods = () => { 
			this.props.firebase.auth
			.fetchSignInMethodsForEmail(this.props.authUser.email)
			.then(activeSignInMethods => this.setState({
				activeSignInMethods,
				error: null
			}),
			).catch(
				error => this.setState({error})
			);
	};

	onSocialLoginLink = provider => {
		//	Link the provided social media account
		this.props.firebase.auth.currentUser
			.linkWithPopup(this.props.firebase[provider])
			.then(this.fetchSignInMethods)
			.catch(error => ({error}));
	};

	onUnlik = providerId => {
		// Unlink the account
		this.props.firebase.auth.currentUser
		.unlink(providerId)
		.then(this.fetchSignInMethods)
		.catch(error => this.setState({error}));
	};

	onDefaultLogin = () => {
		// Extract the social logins to its own components
	};

	onDefaltLoginLink = password => {
		const credential = this.props.firebase.eailAuthProvider.credential(
			this.props.authUser.email,
			password
		);

		this.props.firebase.auth.currentUser.linkAndRetrieveDataWithCredential(credential)
		.then(this.fetchSignInMethods)
		.catch(error => this.setState({error}));
	};

	render() {	
		const {activeSignInMethods, error} = this.state;
		const SocialLoginToggle = ({
			onlyOneLeft,
			isEnabled,
			signInMethod,
			onLink,
			onUnlik
		}) => isEnabled ? (
			<button
			type="button"
			onClick = {() => onLink(signInMethod.id)}
			disabled = {onlyOneLeft}
			>
			Deactivate {signInMethod.id}
			</button>
		):(
			<button
			type="button"
			onClick={()=> onLink(signInMethod.provider)}
			> Link {signInMethod.id}</button>
		);
	
		return(
			<div>
				Sign In Methods:
					<ul>
						{SIGN_IN_METHODS.map(signInMethod => {
							const onlyOneLeft = activeSignInMethods.length === 1;
							const isEnabled = activeSignInMethods.includes(signInMethod.id);
							return(
								<li key={signInMethod.id}>
								{signInMethod.id === 'password' ? (
									<DefaultLoginToggle
									onlyOneLeft = {onlyOneLeft}	
									isEnabled = {isEnabled}
									signInMethod = {signInMethod}
									onLink = {this.onDefaultLoginLink}
									onUnlink = {this.onUnlink}
									/>
								) : (
									<SocialLoginToggle
									onlyOneLeft = {onlyOneLeft}	
									isEnabled = {isEnabled}
									signInMethod = {signInMethod}
									onLink = {this.onSocialLoginLink}
									onUnlink = {this.onUnlink}
									/>
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

class DefaultLoginToggle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {passwwordOne: '', passwordTwo:''};
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.onLink(this.state.passwwordOne);
		this.setState({passwwordOne:'', passwwordTwo: ''});
	};

	onChange = e=> {
		this.setState({[e.target.name]: e.target.vale});
	};

	render() {
		const {
			onlyOneLeft,
			isEnabled,
			signInMethod,
			onUnlink
		} = this.props;

		const { passwordOne, passwordTwo } = this.state;
		const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

		return isEnabled ? (
			<button
			type = 'button'
			onClick = {()=>onUnlink(signInMethod.id)}
			disabled={onlyOneLeft}>
			Deactivate {signInMethod.id}
			</button>
		) : (
			<form onSubmit={this.onSubmit}>
			<input
			name="passwordOne"
			value = {passwordOne}
			onChange = {this.onChange}
			type="password"
			placeholder = "New Password"
			/>
			<input
			name="passwordTwo"
			value = {passwordTwo}
			onChange = {this.onChange}
			type="password"
			placeholder = "Confirm New Password"
			/>
			<button disabled={isInvalid} type="submit">
				Link {signInMethod.id}
			</button>
			</form>
		);
	}
}

export default withAuthorization(condition)(Account);
