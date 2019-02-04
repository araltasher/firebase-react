import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForget = () => (
	<div>
		<PasswordForgetForm />
	</div>
);

const INITIAL_STATE = {
	email: '',
	error: null,
};

class PasswordForgetFormBase extends Component {
	constructor(props) {
		super(props);

		this.state= {...INITIAL_STATE};
	}

	onSubmit = e => {
		const {email} = this.state;

		this.props.firebase.doPasswordReset(email).then(() => {
			this.props.history.push('/landing');
		}).catch(err => {
			this.setState({err});
		});

		e.preventDefault();
	};

	onChange = e => {
		this.setState({[e.target.name]:e.target.value});
	};

	render() {
		const {email, err} = this.state;
		const isInvalid = email === '';

		return(
			<div className="form">
				<div className = "form-panel">
					<div className="form-header">
						<h1>Reset Password</h1>
					</div>
				<div className="form-content">
						<form onSubmit={this.onSubmit}>
						{err && <p className="err">{err.message}</p>}
							<div className="form-group">
								<label>Email</label>
								<input
									name="email"
									value={this.state.email}
									onChange={this.onChange}
									type="text"
									placeholder="Email Address"
								/>
							</div>
						
							<div className="form-group">
								<button className="button-green"disabled={isInvalid} type="submit">Reset Password</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
	</p>
);

export default PasswordForget;

const PasswordForgetForm = compose(withRouter,
	withFirebase)(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
