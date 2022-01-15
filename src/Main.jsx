import React, { useState, useEffect } from 'react';
import { db } from './firebase/firebase-config';
import { collection, onSnapshot } from 'firebase/firestore';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ISSUES } from './constants/issues';

import './main.css';

const initialState = {
	description: '',
	resolved: 'no',
	severity: 'minor',
};

const Main = () => {
	// Issues Collection reference
	const issuesRef = collection(db, ISSUES);
	const [issue, setIssue] = useState(initialState);
	const [issuesList, setIssuesList] = useState([]);
	const [loading, setloading] = useState(false);

	useEffect(() => {
		const unsub = onSnapshot(issuesRef, (snapshot) => {
			let updatedList = [];
			snapshot.docs.forEach((doc) => updatedList.push({ id: doc.id, ...doc.data() }));

			setIssuesList(updatedList);
		});
		setloading(false);

		// unsubscribe from changes when unmounting
		return () => unsub();

		// eslint-disable-next-line
	}, []);

	// Event Handlers
	const onChangeHandler = (e) => {
		setIssue({ ...issue, [e.target.id]: e.target.value });
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();

		if ((issue && !issue.description) || !issue) return;

		try {
			await addDoc(issuesRef, issue);
			setloading(true);
			setIssuesList([...issuesList, issue]);
			setIssue(initialState);
			setloading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const onDeleteHandler = async (e) => {
		e.preventDefault();
		if (!e.target.id) return;

		const issueDocRef = doc(db, ISSUES, e.target.id);

		try {
			await deleteDoc(issueDocRef);
			setloading(true);
			const updatedList = issuesList.filter((issue) => issue.id !== e.target.id);
			setIssuesList(updatedList);
			setloading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const onUpdatedResolved = async (e, issue) => {
		if (!issue) return;

		const updatedIssue = { ...issue, [e.target.id]: e.target.value };
		const issueRef = doc(db, ISSUES, issue.id);

		try {
			await updateDoc(issueRef, updatedIssue);
			setloading(true);
			const updatedList = issuesList.map((el) => (el.id === updatedIssue.id ? updatedIssue : el));

			setIssuesList(updatedList);
			setloading(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h2 className="section-subheading">Firebase Firestore Course</h2>
			<h3 className="section-subheading">Issues List</h3>
			<div className="results-div">
				{!loading ? (
					<table>
						<thead className="highlight-cell">
							<tr>
								<th width="15%">Severity</th>
								<th width="60%">Description</th>
								<th width="15%">Resolved?</th>
								<th width="10%">🦀</th>
							</tr>
						</thead>

						{issuesList &&
							!loading &&
							issuesList.map((issue) => {
								return (
									<tbody id="list-table-body" key={issue.id}>
										<tr>
											<td>{issue.severity}</td>
											<td>{issue.description}</td>
											<td>
												<select
													id="resolved"
													value={issue.resolved}
													onChange={(e) => onUpdatedResolved(e, issue)}
												>
													<option value="yes">yes</option>
													<option value="no">no</option>
												</select>
											</td>
											<td>
												<button
													className="button btn btn-danger"
													readOnly
													id={issue.id}
													onClick={(e) => onDeleteHandler(e)}
												>
													X
												</button>
											</td>
										</tr>
									</tbody>
								);
							})}

						<tfoot className="empty-cell">
							<tr>
								<td>
									<select id="severity" onChange={onChangeHandler}>
										<option value="minor">minor</option>
										<option value="moderate">moderate</option>
										<option value="major">major</option>
									</select>
								</td>
								<td>
									<input
										value={issue.description}
										className="textfield"
										id="description"
										type="text"
										name="description"
										placeholder="e.g. your issue"
										onChange={onChangeHandler}
									/>
								</td>
								<td>
									<select id="resolved" onChange={onChangeHandler}>
										<option value="no">no</option>
										<option value="yes">yes</option>
									</select>
								</td>
								<td>
									<button
										className="button btn btn-primary"
										readOnly
										id="addButton"
										onClick={(e) => onSubmitHandler(e)}
									>
										+
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				) : (
					<p>Loading, please wait</p>
				)}
			</div>
		</div>
	);
};

export default Main;
