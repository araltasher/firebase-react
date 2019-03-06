import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {withFirebase} from '../Firebase';
import './Signup.scss';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUp = () => (
	<div>
		<SignUpForm />
	</div>
);

const INITIAL_STATE = {
	username: '',
	email: '',
	password: '',
	passwordConfirm: '',
	isAdmin: false,
	error: null
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = 'An account with this email address alreday exists. Try to login with this account instead.';

class SignUpFormBase extends Component {

	constructor(props) {
		super(props);
		this.state= {...INITIAL_STATE};
	}

	onSubmit = e => {
		const {username, email, password, isAdmin} = this.state;
		const roles =[];
		
		if (isAdmin) {
			roles.push(ROLES.ADMIN);
		}
		this.props.firebase.doCreateUserWithEmailAndPassword(email,password).then(authUser => {
			//	Create the user in Firebase DB
			return this.props.firebase
					.user(authUser.user.uid)
					.set({
						username,
						email,
						roles
					});
		}).then(()=>{
			this.setState({...INITIAL_STATE});
			this.props.history.push(ROUTES.HOME);
		}).catch(error => {
			if(error.code === ERROR_CODE_ACCOUNT_EXISTS){
				error.message = ERROR_MSG_ACCOUNT_EXISTS;
			}
			this.setState({error});
		});

		e.preventDefault();
	}
	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	}	

	onChangeCheckbox = e => {
		this.setState({[e.target.name]: e.target.checked});
	};

	render() {
		const {
			username,
			email,
			password,
			passwordConfirm,
			isAdmin,
			error} = this.state;

			const isInvalid = password !== passwordConfirm || password === '' || email === '' || username === '';

		return(
			<div className="form">
				<div className = "form-panel">
					<div className="form-header">
      					<h1>Register</h1>
    				</div>
    			<div className="form-content">
						<form onSubmit={this.onSubmit}>
							{error && <p className="err">{error.message}</p>}
							<div className="form-group">
								<label>Username</label>
								<input
									name="username"
									value={username}
									onChange={this.onChange}
									type="text"
								/>
							</div>
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
								<label>Confirm Password</label>
								<input
									name="passwordConfirm"
									value={passwordConfirm}
									onChange={this.onChange}
									type="password"
								/>
							</div>
							<div className="form-group">
								<label>Admin</label>
								<input
									name="isAdmin"
									checked={isAdmin}
									onChange={this.onChangeCheckbox}
									type="checkbox"
								/>
							</div>
							<div className="form-group">
								<button disabled={isInvalid} type="submit">Sign Up</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			
		);
	}
}

const SignUpLink = () => (
	<p>
		Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
	</p>
);

const SignUpForm = compose(withRouter,
					withFirebase,
					)(SignUpFormBase);

export default SignUp;
export {SignUp, SignUpLink};
