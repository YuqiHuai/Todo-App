import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState, useContext } from 'react';
import cookies from 'next-cookies';
import Layout from './components/Layout';
import Axios from 'axios';
import { TodoList, TodoListComponent } from './components/TodoList';
import { ToastContext, Toast } from './contexts/ToastContext';

const Home = (props) => {
	// const [token, setToken] = useContext(TokenContext);
	// console.log(token);
	const [ listName, setListName ] = useState('');
	const [ toasts, setToasts ] = useContext(ToastContext);

	const onNewList = (e) => {
		e.preventDefault();

		if (listName === '') {
			const newToast = new Toast('err', 'Error', 'List name cannot be empty!');
			setToasts([ ...toasts, newToast ]);
			setTimeout(() => {
				($(`#${newToast.id}`) as any).toast('show');
				$(`#${newToast.id}`).on('hidden.bs.toast', function() {
					newToast.dismissed = true;
					$(`#${newToast.id}`).remove();
				});
			}, 500);

			return;
		}

		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.post(`/v1/todo/list`, { name: listName }, { headers: { access_token: accessToken } })
			.then((res) => {
				setListName('');
				Router.push('/');
			})
			.catch((err) => {
				// alert('Something went wrong!');
				const newToast = new Toast('err', 'Error', 'Something went wrong!');
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					setTimeout(() => {
						($(`#${newToast.id}`) as any).toast('show');
						$(`#${newToast.id}`).on('hidden.bs.toast', function() {
							newToast.dismissed = true;
							$(`#${newToast.id}`).remove();
						});
					}, 500);
				});
			});
	};

	return (
		<Layout page="home" loggedIn={props.loggedIn}>
			<div className="p-4">
				<h1>Todo Lists</h1>
				<div className="d-flex align-items-center">
					<input
						className="border rounded"
						value={listName}
						onChange={(e) => {
							setListName(e.target.value);
						}}
					/>
					<button className="btn btn-sm btn-outline-success ml-2" onClick={onNewList}>
						Create New List
					</button>
				</div>
			</div>
			{props.list && (
				<ul>
					{(props.list as TodoList[]).map((list) => {
						return <TodoListComponent key={list._id} list={list} />;
					})}
				</ul>
			)}
		</Layout>
	);
};

// export default connect(state => state)(Home);
Home.getInitialProps = async (ctx) => {
	const allCookies = cookies(ctx);

	if (!allCookies.access_token) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: '/login'
			});
			ctx.res.end();
		} else {
			Router.push('/login');
		}
		return { loggedIn: false };
	}

	const ENDPOINT = ctx.req ? 'http://service-nginx/v1/todo/list' : '/v1/todo/list';

	return Axios.get(ENDPOINT, { headers: { access_token: allCookies.access_token } })
		.then((response) => {
			console.log(response.data as TodoList);
			return { loggedIn: true, list: response.data as TodoList };
		})
		.catch((err) => {
			console.log(err);

			if (ctx.res) {
				ctx.res.writeHead(302, {
					Location: '/login'
				});
				ctx.res.end();
			} else {
				document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
				Router.push('/login');
			}
			return { loggedIn: false };
		});
};

export default Home;
