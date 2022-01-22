import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Issues from './pages/issues/Issues';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthProvider from './context/auth';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

const App = () => {
	return (
		<Router>
			<AuthProvider>
				<Navbar />
				<Routes>
					<Route
						exact
						path="/"
						element={
							<PrivateRoute>
								<Issues />
							</PrivateRoute>
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
};

export default App;
