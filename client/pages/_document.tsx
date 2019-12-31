import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class CustomDocument extends Document {
	static getInitialProps(ctx) {
		const { html, head, errorHtml, chunks } = ctx.renderPage();
		const styles = flush();

		return { ...ctx, html, head, errorHtml, chunks, styles };
	}

	render() {
		return (
			<html>
				<Head>
					<script src="/static/jquery/dist/jquery.js" />
					<script src="/static/popper.js/dist/umd/popper.min.js" />
					<script src="/static/bootstrap/dist/js/bootstrap.js" />
					<link rel="stylesheet" type="text/css" href="/static/bootstrap/dist/css/bootstrap.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
