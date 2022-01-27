import React, { useState } from 'react';
import { auth } from '../../firebase/firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SMSAuth = () => {
	const navigate = useNavigate();
	const countryCode = '+358';
	const [phone, setPhone] = useState(countryCode);
	const [isExpanded, setIsExpanded] = useState(false);
	const [oneTimePass, setOneTimePass] = useState(null);
	const [error, setError] = useState(null);

	const recaptchaGenerator = (auth) => {
		window.recaptchaVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{
				size: 'invisible',
				callback: (response) => {},
			},
			auth
		);
	};

	const oneTimePassReq = (e) => {
		e.preventDefault();

		if (phone.length >= 12) {
			setIsExpanded(true);
			recaptchaGenerator(auth);
			const appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(auth, phone, appVerifier)
				.then((confirmationResult) => {
					window.confirmationResult = confirmationResult;
				})
				.catch((error) => {
					setError(error.message);
				});
		}
	};

	const onVerifyOneTimePass = (value) => {
		setOneTimePass(value);

		if (value.length === 6) {
			let confirmationResult = window.confirmationResult;

			confirmationResult
				.confirm(value)
				.then((result) => {
					// User signed in successfully.
					const user = result.user;
					// TODO: ADD USER TO FIRESTORE
					// TODO: REDIRECT
					navigate('/');
				})
				.catch((error) => {
					setError(error.message);
				});
		}
	};

	return (
		<>
			<h3>Enter your phone number</h3>
			<form>
				<div className="form-controls">
					<label htmlFor="phone">Phone Number</label>
					<input
						value={phone || ''}
						type="text"
						name="phone"
						onChange={({ target }) => setPhone(target.value)}
					/>
				</div>
				{isExpanded ? (
					<div className="form-controls">
						<label htmlFor="otp">OTP</label>
						<input
							value={oneTimePass || ''}
							type="text"
							name="otp"
							onChange={({ target }) => onVerifyOneTimePass(target.value)}
						/>
						<p>Please enter the code sent to your phone</p>
					</div>
				) : (
					<div className="button-container">
						<button className="button-register" onClick={oneTimePassReq}>
							Request One-Time Pass
						</button>
					</div>
				)}

				{error && <span className="error">{error}</span>}

				<div id="recaptcha-container"></div>
			</form>
		</>
	);
};

export default SMSAuth;
