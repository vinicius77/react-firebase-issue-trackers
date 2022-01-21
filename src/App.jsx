import React from 'react';
import Issues from './components/Issues/Issues';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Register from './pages/register/Register';
import Login from './pages/login/Login';

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route exact path="/" element={<Issues />} />
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	);
};

export default App;