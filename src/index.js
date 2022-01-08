import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ISSUES } from './constants/issues';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection /*onSnapshot*/ } from 'firebase/firestore';
import Main from './Main';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize DB Firestore Services
const db = getFirestore();

// Issues Collection reference
const issuesRef = collection(db, ISSUES);

// Triggers to update the data
/*onSnapshot(issuesRef, (snapshot) => {
	let updatedIssues = [];
	snapshot.docs.forEach((doc) => {
		updatedIssues.push({ ...doc.data(), id: doc.id });
	});
});*/

ReactDOM.render(
	<React.StrictMode>
		<Main issuesRef={issuesRef} db={db} />
	</React.StrictMode>,
	document.getElementById('root')
);
