import Layout from './components/Layout';
import { useState, useContext } from 'react';
import { ToastContext, Toast } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import Axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import cookies from 'next-cookies';

const Register = () => {
	const [ name, setName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ toasts, setToasts ] = useContext(ToastContext);

	const loadToast = (msg: string) => {
		const newToast = new Toast('error', 'Error', msg);
		setToasts([ ...toasts, newToast ]);
		setTimeout(() => {
			($(`#${newToast.id}`) as any).toast('show');
			$(`#${newToast.id}`).on('hidden.bs.toast', function() {
				newToast.dismissed = true;
				$(`#${newToast.id}`).remove();
			});
		}, 200);
	};

	const registerAccount = (e) => {
		e.preventDefault();
		if (email === '' || password === '' || name === '') {
			loadToast('Name, Email and Password cannot be empty!');
			return;
		}
		Axios.post('/v1/auth/register', { name, email, password })
			.then((res) => {
				Router.push('/login');
			})
			.catch((err) => {
				loadToast(err.response.data.message);
			});
	};

	return (
		<div>
			<ToastContainer />
			<div
				style={{ height: '100vh', width: '100vw', backgroundColor: '#f4f4f4' }}
				className="d-flex align-items-center justify-content-center"
			>
				<div className="card p-3">
					<h1>Register Account</h1>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon0">
								Name
							</span>
						</div>
						<input
							type="text"
							className="form-control"
							placeholder="Name"
							aria-label="Name"
							aria-describedby="basic-addon0"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Email
							</span>
						</div>
						<input
							type="text"
							className="form-control"
							placeholder="Email"
							aria-label="Email"
							aria-describedby="basic-addon1"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon2">
								Password
							</span>
						</div>
						<input
							type="password"
							className="form-control"
							placeholder="Password"
							aria-label="Password"
							aria-describedby="basic-addon2"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button className="btn btn-primary" onClick={registerAccount}>
						Register
					</button>

                    <Link href='/login'>
                        <a className='text-center mt-2'>Have an account? Log in</a>
                    </Link>
				</div>
			</div>
		</div>
	);
};

Register.getInitialProps = ctx => {
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
}

export default Register;
