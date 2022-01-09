import React, { useState } from 'react';
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

	onSnapshot(issuesRef, (snapshot) => {
		snapshot.docChanges().forEach((change) => {
			let issues = [];
			if (change.type === 'added' || change.type === 'removed') {
				if (issuesList.length !== snapshot.docs.length) {
					snapshot.docs.map((doc) => issues.push({ ...doc.data(), id: doc.id }));
					return setIssuesList(issues);
				}
			} else if (change.type === 'modified') {
				// TODO: UPDATING LOGIC
				return console.log(change.type.toUpperCase(), change.doc.data());
			}
		});
	});

	// Event Handlers
	const onChangeHandler = (e) => {
		setIssue({ ...issue, [e.target.id]: e.target.value });
	};

	const onSubmitHandler = (e) => {
		e.preventDefault();

		if ((issue && !issue.description) || !issue) return;
		addDoc(issuesRef, issue);
		setIssue(initialState);
	};

	const onDeleteHandler = async (e) => {
		e.preventDefault();
		if (!e.target.id) return;
		const issueDocRef = doc(db, ISSUES, e.target.id);
		const updatedList = issuesList.filter((issue) => issue.id !== e.target.id);
		setIssuesList(updatedList);
		await deleteDoc(issueDocRef);
	};

	const onUpdatedResolved = async (e, issue) => {
		if (!issue) return;
		const updatedIssue = { ...issue, [e.target.id]: e.target.value };

		const issueRef = doc(db, ISSUES, issue.id);
		try {
			await updateDoc(issueRef, updatedIssue);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h2 className="section-subheading">Firebase Firestore Course</h2>
			<h3 className="section-subheading">Issues List</h3>
			<div className="results-div">
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
			</div>
		</div>
	);
};

export default Main;
