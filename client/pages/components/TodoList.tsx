import { useState, useContext } from 'react';
import Axios from 'axios';
import Router from 'next/router';
import { ToastContext, Toast } from '../contexts/ToastContext';

export interface TodoItem {
	_id: string;
	name: string;
	completed: boolean;
	createdAt: number;
}

export interface TodoList {
	_id: string;
	name: string;
	items: TodoItem[];
	createdAt: number;
}

export const TodoListItemComponent = (props) => {
	const item = props.item as TodoItem;
	const [ toasts, setToasts ] = useContext(ToastContext);
	const onItemCompletion = (e) => {
		e.preventDefault();
		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.put(
			`/v1/todo/list/${props.listId}/${item._id}`,
			{ completed: true },
			{ headers: { access_token: accessToken } }
		)
			.then((res) => {
				Router.push('/');
			})
			.catch((err) => {
				// alert('Something went wrong!');
				const newToast = new Toast('err', 'Error', 'Something went wrong!');
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					($(`#${newToast.id}`) as any).toast('show');
					$(`#${newToast.id}`).on('hidden.bs.toast', function() {
						newToast.dismissed = true;
						$(`#${newToast.id}`).remove();
					});
				}, 500);
			});
	};
	const onItemDelete = (e) => {
		e.preventDefault();
		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.delete(`/v1/todo/list/${props.listId}/${item._id}`, { headers: { access_token: accessToken } })
			.then((res) => {
				Router.push('/');
			})
			.catch((err) => {
				// alert('Something went wrong!');
				const newToast = new Toast('err', 'Error', 'Something went wrong!');
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					($(`#${newToast.id}`) as any).toast('show');
					$(`#${newToast.id}`).on('hidden.bs.toast', function() {
						newToast.dismissed = true;
						$(`#${newToast.id}`).remove();
					});
				}, 500);
			});
	};

	return (
		<div className="d-flex align-items-center justify-content-between mt-1 mb-1">
			<h4 className="m-0 d-flex align-items-center">
				{item.name}
				{item.completed && <span className="ml-2 badge badge-success">Completed</span>}
				{!item.completed && <span className="ml-2 badge badge-danger">Incomplete</span>}
			</h4>

			<div>
				{!item.completed && (
					<button className="btn btn-outline-success" onClick={onItemCompletion}>
						Complete
					</button>
				)}
				<button className="ml-2 btn btn-outline-danger" onClick={onItemDelete}>
					Delete
				</button>
			</div>
		</div>
	);
};

export const TodoListComponent = (props) => {
	const list = props.list as TodoList;

	const [ itemName, setItemName ] = useState('');
	const [ toasts, setToasts ] = useContext(ToastContext);

	const addNewItem = (e) => {
		e.preventDefault();

		if (itemName === '') {
			alert('Incomplete item name!');
			return;
		}

		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.post(`/v1/todo/list/${list._id}`, { name: itemName }, { headers: { access_token: accessToken } })
			.then((res) => {
				setItemName('');
				Router.push('/');
			})
			.catch((err) => {
				// alert('Something went wrong!');
				const newToast = new Toast('err', 'Error', 'Something went wrong!');
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					($(`#${newToast.id}`) as any).toast('show');
					$(`#${newToast.id}`).on('hidden.bs.toast', function() {
						newToast.dismissed = true;
						$(`#${newToast.id}`).remove();
					});
				}, 500);
			});
	};

	const deleteList = (e) => {
		e.preventDefault();
		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.delete(`/v1/todo/list/${list._id}`, { headers: { access_token: accessToken } })
			.then((res) => {
				Router.push('/');
			})
			.catch((err) => {
				// alert('Something went wrong!');
				const newToast = new Toast('err', 'Error', 'Something went wrong!');
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					($(`#${newToast.id}`) as any).toast('show');
					$(`#${newToast.id}`).on('hidden.bs.toast', function() {
						newToast.dismissed = true;
						$(`#${newToast.id}`).remove();
					});
				}, 500);
			});
	};

	return (
		<div className="card mb-4 shadow">
			<div className="card-body">
				<h5 className="card-title d-flex align-items-center mb-2">
					{list.name}
					<button className="btn btn-outline-danger ml-2" onClick={deleteList}>
						delete
					</button>
				</h5>
				<div className="input-group mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="New item"
						aria-label="New Item"
						aria-describedby="button-addon2"
						value={itemName}
						onChange={(e) => setItemName(e.target.value)}
					/>
					<div className="input-group-append">
						<button className="btn btn-info" type="button" id="button-addon2" onClick={addNewItem}>
							Add Item
						</button>
					</div>
				</div>
				{list.items.length != 0 ? (
					<ul className="list-group list-unstyled">
						{list.items.map((item) => {
							return (
								<li key={item._id}>
									<TodoListItemComponent item={item} listId={list._id} />
								</li>
							);
						})}
					</ul>
				) : (
					<p>No item yet</p>
				)}
			</div>
		</div>
	);
};
