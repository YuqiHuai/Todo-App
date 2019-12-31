import Link from 'next/link';

import Axios from 'axios';
import ToastContainer from './ToastContainer';

const Layout = (props) => {
	const pages = [ 'home', 'about', 'login' ];
	const classNames = [ 'nav-item', 'nav-item', 'nav-item' ];
	if (props.page) {
		const index = pages.indexOf(props.page);
		classNames[index] += ' active';
	}

	const onLogout = () => {
		// Axios.get('/v1/auth/logout', {headers: {access_token: document.cookies.}})
		const accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, '$1');
		Axios.get('/v1/auth/logout', { headers: { access_token: accessToken } });
		document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	};

	return (
		<div>
			<ToastContainer />

			<div className="container">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<Link href="/">
						<a className="navbar-brand">Todo</a>
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className={classNames[0]}>
								<Link href="/">
									<a className="nav-link">Home</a>
								</Link>
							</li>
							<li className={classNames[1]}>
								<Link href="/about">
									<a className="nav-link">About</a>
								</Link>
							</li>
							<li className={classNames[2]}>
								{!props.loggedIn && (
									<Link href="/login">
										<a className="nav-link">Login</a>
									</Link>
								)}
								{props.loggedIn && (
									<Link href="/login">
										<a className="nav-link" onClick={onLogout}>
											Logout
										</a>
									</Link>
								)}
							</li>
							{!props.loggedIn && (
								<li>
									<Link href="/register">
										<a className="nav-link">Register</a>
									</Link>
								</li>
							)}
						</ul>
					</div>
				</nav>
				{props.children}
			</div>
		</div>
	);
};

export default Layout;
