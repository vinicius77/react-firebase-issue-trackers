import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { USERS } from '../../constants/users';
import { auth, db } from '../../firebase/firebase-config';
import './navbar.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';

const Navbar = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const onSignOutHandle = async () => {
		try {
			const userRef = doc(db, USERS, auth.currentUser.uid);
			const updatedUser = {
				isOnline: false,
			};

			await updateDoc(userRef, updatedUser);
			await signOut(auth);

			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<nav>
			<h3>
				<Link to="/">Home</Link>
			</h3>
			<div>
				{user ? (
					<>
						<Link to="/profile">Profile</Link>
						<button className="logout-btn" onClick={onSignOutHandle}>
							Log out
						</button>
					</>
				) : (
					<>
						<Link to="/register">Register</Link>
						<Link to="/login">Login</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
