import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../components/Loading/Loading';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUser(user);
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
