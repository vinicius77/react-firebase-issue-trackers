import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth, db } from '../../firebase/firebase-config';
import { USERS } from '../../constants/users';
import { updateDoc, doc } from 'firebase/firestore';
import './login.css';
import { useNavigate } from 'react-router-dom';

const initialState = {
	email: '',
	password: '',
};

const Login = () => {
	const navigate = useNavigate();
	const [fields, setFields] = useState(initialState);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const onChangeHandler = (e) => {
		setFields({ ...fields, [e.target.name]: e.target.value });
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		const { email, password } = fields;

		if (!email || !password) {
			setIsLoading(false);
			setError('All fields are required');
			return;
		}

		try {
			// login into account
			const result = await signInWithEmailAndPassword(auth, email, password);
			const userRef = doc(db, USERS, result.user.uid);
			const updatedUser = {
				isOnline: true,
			};

			// updates the user also on users collection
			await updateDoc(userRef, updatedUser);

			setIsLoading(false);
			setFields(initialState);

			// redirects to home after login
			navigate('/');
		} catch (error) {
			setIsLoading(false);
			setError(error.message);
		}
	};

	return (
		<section className="login-form">
			<h3>Log into your account</h3>
			<form className="form">
				<div className="form-controls">
					<label htmlFor="email">Email</label>
					<input value={fields.email || ''} type="email" name="email" onChange={onChangeHandler} />
				</div>
				<div className="form-controls">
					<label htmlFor="password">Password</label>
					<input
						value={fields.password || ''}
						type="password"
						name="password"
						onChange={onChangeHandler}
					/>
				</div>

				{error && <span className="error">{error}</span>}

				<div className="button-container">
					<button className="button-login" onClick={onSubmitHandler} disabled={isLoading}>
						Login{isLoading && 'g in...'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default Login;
