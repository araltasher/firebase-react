import React, {Component} from 'react';
import {withFirebase} from '../Firebase';

const INITIAL_STATE = {
	newPassword: '',
	newPasswordConfirm: '',
	err: null
};

class PasswordChangeForm extends Component {
	constructor(props) {
		super(props);
		this.state = {...INITIAL_STATE};
	}

	onSubmit = e => {
		const {newPassword} = this.state;
		this.props.firebase.doPasswordUpdate(newPassword)
		.then(()=>{
			this.setState({...INITIAL_STATE});
		})
		.catch(err => {
			this.setState({err});
		});
		e.preventDefault();
	};

	onChange = e => {
		this.setState({[e.target.name]:e.target.value});
	}

	render() {
		const {newPassword, newPasswordConfirm, err} = this.state;

		const isInvalid = newPassword !== newPasswordConfirm || newPassword === '';

		return(
			<div className="form">
				<div className = "form-panel">
					<div className="form-header">
      					<h1>Change Password</h1>
    				</div>
    			<div className="form-content">
						<form onSubmit={this.onSubmit}>
						{err && <p className="err">{err.message}</p>}
							<div className="form-group">
								<label>Password</label>
								<input
									name="newPassword"
									value={newPassword}
									onChange={this.onChange}
									type="password"
								/>
							</div>
							<div className="form-group">
								<label>Confirm Password</label>
								<input
									name="newPasswordConfirm"
									value={newPasswordConfirm}
									onChange={this.onChange}
									type="password"
								/>
							</div>
							<div className="form-group">
								<button disabled={isInvalid} type="submit">Reset Password</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
} 


export default withFirebase(PasswordChangeForm);
