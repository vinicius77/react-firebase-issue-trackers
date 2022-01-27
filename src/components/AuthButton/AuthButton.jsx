import React from 'react';
import './authButton.css';
import Icon from '../Icon/Icon';

const AuthButton = ({ provider, icon, onClick, background }) => {
	return (
		<div className="container">
			<button className="auth-btn" style={{ background }} onClick={onClick}>
				<Icon icon="google" viewBox="0 0 512 512" /> Sign in with {provider}
			</button>
		</div>
	);
};

export default AuthButton;
