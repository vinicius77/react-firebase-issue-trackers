import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import React, { useState } from 'react';
import { auth, db } from '../../firebase/firebase-config';
import { USERS } from '../../constants/users';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import './register.css';
import { useNavigate } from 'react-router-dom';
import AuthButton from '../../components/AuthButton/AuthButton';
import SMSAuth from '../../components/SMSAuth/SMSAuth';

const initialState = {
	name: '',
	email: '',
	password: '',
};

const Register = () => {
	const navigate = useNavigate();
	const [fields, setFields] = useState(initialState);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSMS, setIsSMS] = useState(false);

	const onChangeHandler = (e) => {
		setFields({ ...fields, [e.target.name]: e.target.value });
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		const { name, email, password } = fields;

		if (!name || !email || !password) {
			setIsLoading(false);
			setError('All fields are required');
			return;
		}

		try {
			// creates the login account
			const { user } = await createUserWithEmailAndPassword(auth, email, password);

			const userRef = doc(db, USERS, user.uid);

			const newUser = {
				uid: user.uid,
				email,
				name,
				createdAt: Timestamp.fromDate(new Date()),
				isOnline: true,
			};

			// creates the user also on users collection
			await setDoc(userRef, newUser);
			setIsLoading(false);
			setFields(initialState);

			// redirects to home after login
			navigate('/');
		} catch (error) {
			setIsLoading(false);
			setError(error.message);
		}
	};

	/** Third Part Authentication */
	const onGoogleSignIn = async (e) => {
		e.preventDefault();

		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			const user = result.user;

			const newUser = {
				uid: user.uid,
				email: user.email,
				name: user.displayName,
				createdAt: Timestamp.fromDate(new Date()),
				isOnline: true,
			};

			const userRef = doc(db, USERS, user.uid);
			await setDoc(userRef, newUser);

			navigate('/');
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<section className="register-form">
			{!isSMS ? (
				<>
					<h3>Create an account</h3>
					<form className="form">
						<div className="form-controls">
							<label htmlFor="name">Name</label>
							<input value={fields.name || ''} type="text" name="name" onChange={onChangeHandler} />
						</div>
						<div className="form-controls">
							<label htmlFor="email">Email</label>
							<input
								value={fields.email || ''}
								type="email"
								name="email"
								onChange={onChangeHandler}
							/>
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
							<button className="button-register" onClick={onSubmitHandler} disabled={isLoading}>
								Register{isLoading && 'ing ...'}
							</button>
						</div>

						<AuthButton
							provider="Google"
							icon="google"
							onClick={onGoogleSignIn}
							background="#fff"
						/>
					</form>
				</>
			) : (
				<SMSAuth />
			)}

			<AuthButton
				provide="SMS"
				icon="google"
				onClick={() => setIsSMS(!isSMS)}
				background="#02bd7e"
				isSMS={isSMS}
			/>
		</section>
	);
};

export default Register;
