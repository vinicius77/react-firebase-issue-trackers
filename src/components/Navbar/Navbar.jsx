import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
	return (
		<nav>
			<h3>
				<Link to="/">Home</Link>
			</h3>
			<div>
				<Link to="/register">Register</Link>
				<Link to="/login">Login</Link>
			</div>
		</nav>
	);
};

export default Navbar;
