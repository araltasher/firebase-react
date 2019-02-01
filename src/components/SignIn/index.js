import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {SignUpLink} from '../SignUp';
import {withFirebase} from '../Firebase';
import '../SignUp/Signup.scss';

import * as ROUTES from '../../constants/routes';

const SignIn = () => (
	<div>
		<SignInForm />
	</div>
);

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
			</div>
			
		);
	}
}


const SignInForm = compose(withRouter,
					withFirebase,
					)(SignInFormBase);

export default SignIn;
export {SignInForm};
