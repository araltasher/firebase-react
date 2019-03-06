import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {SignUpLink} from '../SignUp';
import {PasswordForgetLink} from '../PasswordForget';
import {withFirebase} from '../Firebase';
import '../SignUp/Signup.scss';

import * as ROUTES from '../../constants/routes';


const SignIn = () => (
	<div>
		<SignInForm />
		<SignInGoogle />
		<SignInFacebook />
		<SignInTwitter />
		<SignInGithub />
	</div>
);

//	Extracting the error code and message for
//	multiple accounts as variables
const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = 'An account with an email address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page';

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null
}

class SignInFormBase extends Component {

	constructor(props) {
		super(props);
		this.state= {...INITIAL_STATE};
	}

	onSubmit = event => {
		const { email, password } = this.state;
	
		this.props.firebase
		  .doSignInWithEmailAndPassword(email, password)
		  .then(() => {
			this.setState({ ...INITIAL_STATE });
			this.props.history.push(ROUTES.HOME);
		  })
		  .catch(error => {
			this.setState({ error });
		  });
	
		event.preventDefault();
	  };
	
	  onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	  };


	render() {
		const {
			email,
			password,
			error} = this.state;

			const isInvalid = password === '' || email === '';

		return(
			<div className="form">
				<div className = "form-panel">
					<div className="form-header">
      					<h1>Sign In</h1>
    				</div>
    			<div className="form-content">
						<form onSubmit={this.onSubmit}>
							{error && <p className="err">{error.message}</p>}
							<div className="form-group">
								<label>Email</label>
								<input
									name="email"
									value={email}
									onChange={this.onChange}
									type="email"
								/>
							</div>
							<div className="form-group">
								<label>Password</label>
								<input
									name="password"
									value={password}
									onChange={this.onChange}
									type="password"
								/>
							</div>
							<div className="form-group">
								<button disabled={isInvalid} type="submit">Sign In</button>
							</div>
						</form>
					</div>
				</div>
				<SignUpLink />
				<PasswordForgetLink />
				<br/>
			</div>
			
		);
	}
}

class SignInGoogleBase extends Component {
	constructor(props){
		super(props);
		this.state = {error: null};
	}

	onSubmit = e => {
		this.props.firebase.doSignInWithGoogle().then(socialAuthUser => {
			//	Create a user in Firebase DB as well
			return this.props.firebase.user(socialAuthUser.user.uid).set({
				username: socialAuthUser.user.displayName,
				email:socialAuthUser.user.email,
				roles: [],
			});
		}).then(() => {
			this.setState({ error: null});
			this.props.history.push(ROUTES.HOME);
		}).catch(error => {
			if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
				error.message = ERROR_MSG_ACCOUNT_EXISTS;
			}
			this.setState({error});
		});
		e.preventDefault();
	};

	render() {
		const { error } = this.state;
		return (
			<form onSubmit = {this.onSubmit}>
				<button type="submit">Sign In with Google</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

class SignInFacebookBase extends Component{
	constructor(props) {
		super(props);
		this.state = {error: null};
	}	

	onSubmit = e => {
		this.props.firebase.doSignInWithFacebook().then(socialAuthUser => {
			//	Create a user in Firebase DB
			return this.props.firebase.user(socialAuthUser.user.uid).set({
				username:socialAuthUser.additionalUserInfo.profile.name,
				email:socialAuthUser.additionalUserInfo.profile.email,
				roles: [],
			});
		})
		.then(()=>{
			this.setState({error:null});
			this.props.history.push(ROUTES.HOME);
		}).catch(error => {
			if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
				error.message = ERROR_MSG_ACCOUNT_EXISTS;
			}
			this.setState({error});
		});

		e.preventDefault();
	};

	render() {
		const {error} = this.state;
		return(
			<form onSubmit={this.onSubmit}>
				<button type="submit">Sign in with Facebook</button>
				{error && <p>{error.message}</p>}
			</form>
		);
	}

}

class SignInTwitterBase extends Component {
	constructor(props) {
		super(props);
		this.state = {error: null};
	}

	onSubmit = e => {
		this.props.firebase.doSignInWithTwitter().then(socialAuthUser => {
			//	Create user in Firebase DB
			return this.props.firebase.user(socialAuthUser.user.uid)
			.set({
				username: socialAuthUser.additionalUserInfo.profile.name,
				email: socialAuthUser.additionalUserInfo.profile.email,
				roles: []
			});
		}).then(() => {
			this.setState({error: null});
			this.props.history.push(ROUTES.HOME);
		}).catch(error => {
			if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
				error.message = ERROR_MSG_ACCOUNT_EXISTS;
			}
			this.setState({error});
		});
		e.preventDefault();
	}

	render(){
		const {error} = this.state;
		return(
		<form onSubmit={this.onSubmit}>
			<button type="submit">Sign In with Twitter</button>
			{error && <p>{error.message}</p>}
		</form>
		);
	}
}

class SignInGithubBase extends Component {
	constructor(props) {
		super(props);
		this.state = {error:null};
	}

	onSubmit = e=> {
		this.props.firebase.doSignInWithGithub().then(socialAuthUser => {
		// Create user in Firebase DB
		return this.props.firebase.user(socialAuthUser.user.uid)
		.set({
			username: socialAuthUser.additionalUserInfo.profile.name,
			email: socialAuthUser.additionalUserInfo.profile.email,
			roles: []
			});
		})
		.then(() => {
			this.setState({error: null});
			this.props.history.push(ROUTES.HOME);
		}).catch(error => {
			if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
				error.message = ERROR_MSG_ACCOUNT_EXISTS;
			}
			this.setState({error});
		});
		e.preventDefault();
	}

	render(){
		const {error} = this.state;
		return(
		<form onSubmit={this.onSubmit}>
			<button type="submit">Sign In with Github</button>
			{error && <p>{error.message}</p>}
		</form>
		);
	}
}



const SignInForm = compose(withRouter,
					withFirebase,
					)(SignInFormBase);

const SignInGoogle = compose(withRouter,
					withFirebase,)(SignInGoogleBase);

const SignInFacebook = compose(withRouter,
					withFirebase,)(SignInFacebookBase);

const SignInTwitter = compose (withRouter,
					withFirebase)(SignInTwitterBase);
const SignInGithub = compose (withRouter,
					withFirebase)(SignInGithubBase);

export default SignIn;
export {SignInForm, SignInGoogle, SignInFacebook, SignInTwitter, SignInGithub};
