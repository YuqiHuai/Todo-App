import { useState, FormEvent, useContext } from 'react';
import Router from 'next/router';
import axios from 'axios';
import Layout from './components/Layout';
import { ToastContext, Toast } from './contexts/ToastContext';
import cookies from 'next-cookies';

const Login = (props) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ toasts, setToasts ] = useContext(ToastContext);

	const [ btnClass, setBtnClass ] = useState('btn btn-primary btn-lg');
	const [ loadClass, setLoadClass ] = useState('d-none');

	const onInputChange = (event) => {
		if (event.target.name === 'email') {
			setEmail(event.target.value);
		} else {
			// password
			setPassword(event.target.value);
		}
	};

	const onLogin = async (event: FormEvent) => {
		event.preventDefault();
		console.log({ email, password });

		setBtnClass('btn btn-primary btn-lg disabled');
		setLoadClass('d-flex justify-content-center mt-2');

		await axios
			.post('/v1/auth/login', { email, password })
			.then((response) => {
				// localStorage.setItem('access_token', response.data.access_token);
				document.cookie = `access_token=${response.data.access_token}`;
				Router.push('/');
				// console.log(response.data);
			})
			.catch((error) => {
				const newToast = new Toast('error', 'Error', error.response.data.message);
				setToasts([ ...toasts, newToast ]);
				setTimeout(() => {
					($(`#${newToast.id}`) as any).toast('show');
					$(`#${newToast.id}`).on('hidden.bs.toast', function() {
						newToast.dismissed = true;
						$(`#${newToast.id}`).remove();
					});
				}, 500);
				setBtnClass('btn btn-primary btn-lg');
				setLoadClass('d-none');
			});
	};

	return (
		<Layout page="login" loggedIn={props.loggedIn}>
			<form onSubmit={onLogin}>
				<div className="form-group">
					<label>Email address</label>
					<input
						type="email"
						className="form-control"
						name="email"
						aria-describedby="emailHelp"
						onChange={onInputChange}
						value={email}
					/>
					<small id="emailHelp" className="form-text text-muted">
						We'll never share your email with anyone else.
					</small>
				</div>
				<div className="form-group">
					<label>Password</label>
					<input
						type="password"
						className="form-control"
						name="password"
						onChange={onInputChange}
						value={password}
					/>
				</div>
				<div className="d-flex justify-content-center">
					<button type="submit" className={btnClass}>
						Login
					</button>
				</div>
				<div className={loadClass}>
					<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			</form>
		</Layout>
	);
};

Login.getInitialProps = async (ctx) => {
	const allCookies = cookies(ctx);

	if (allCookies.access_token) {
		if (ctx.res) {
			ctx.res.writeHead(302, {
				Location: '/'
			});
			ctx.res.end();
		} else {
			Router.push('/');
		}
		return { loggedIn: true };
	}
	return { loggedIn: false };
};

export default Login;
