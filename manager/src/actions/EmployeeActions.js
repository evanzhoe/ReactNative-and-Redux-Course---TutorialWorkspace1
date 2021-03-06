import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
	EMPLOYEE_UPDATE,
	EMPLOYEE_CREATE,
	EMPLOYEES_FETCH_SUCCESS
} from './types';

export const employeeUpdate = ({ props, value }) => {
	return {
		type: EMPLOYEE_UPDATE,
		payload: { props, value }
	};
};

export const employeeCreate = ({ name, phone, shift }) => {
	const { currentUser } = firebase.auth();

	return dispatch => {
		dispatch({ type: EMPLOYEE_CREATE });
		firebase
			.database()
			.ref(`users/${currentUser.uid}/employees`)
			.push({ name, phone, shift })
			.then(() => Actions.employeeList({ type: 'reset' }));
	};
};

export const employeesFetch = () => {
	const { currentUser } = firebase.auth();

	return dispatch => {
		firebase
			.database()
			.ref(`users/${currentUser.uid}/employees`)
			.on('value', snapshot => {
				dispatch({ type: EMPLOYEES_FETCH_SUCCESS, payload: snapshot.val() });
			});
	};
};
