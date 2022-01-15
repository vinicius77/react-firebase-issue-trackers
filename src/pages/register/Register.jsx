import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth, db } from '../../firebase/firebase-config';
import { USERS } from '../../constants/users';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import './register.css';
import { useNavigate } from 'react-router-dom';

const initialState = {
	name: '',
	email: '',
	password: '',
};

const Register = () => {
	const usersRef = collection(db, USERS);
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
		const { name, email, password } = fields;

		if (!name || !email || !password) {
			setIsLoading(false);
			setError('All fields are required');
			return;
		}

		try {
			// creates the login account
			await createUserWithEmailAndPassword(auth, email, password);

			const newUser = {
				email,
				name,
				createdAt: Timestamp.fromDate(new Date()),
				isOnline: true,
			};

			// creates the user also on users collection
			await addDoc(usersRef, newUser);
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
		<section className="register-form">
			<h3>Create an account</h3>
			<form className="form">
				<div className="form-controls">
					<label htmlFor="name">Name</label>
					<input value={fields.name || ''} type="text" name="name" onChange={onChangeHandler} />
				</div>
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
					<button className="button-register" onClick={onSubmitHandler}>
						Register
					</button>
				</div>
			</form>
		</section>
	);
};

export default Register;
