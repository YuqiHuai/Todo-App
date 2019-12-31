import Link from 'next/link';
import Layout from './components/Layout';
import cookies from 'next-cookies';
import Router from 'next/router';

const About = (props) => (
	<Layout page="about" loggedIn={props.loggedIn}>
		<div className="p-4">
			<h2>About</h2>
			<p>Author: Yuqi Huai</p>
			<p>Todo Application, an example using NestJS Microservices, NextJS Server-Side-Rendered React.</p>
		</div>
	</Layout>
);

About.getInitialProps = (ctx) => {
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
	return { loggedIn: true };
};
export default About;
