const ToastComponent = (props) => {
	const divClass = props.toast.dismissed ? 'toast hide' : 'toast';
	return (
		<div
			className={divClass}
			id={props.toast.id}
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
			data-autohide="true"
			data-animation="true"
			data-delay="5000"
		>
			<div className="toast-header">
				{/* <img src="..." className="rounded mr-2" alt="..." /> */}
				<strong className="mr-auto">{props.toast.title}</strong>
				{/* <small>11 mins ago</small> */}
				<button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div className="toast-body">{props.toast.message}</div>
		</div>
	);
};

export default ToastComponent;
