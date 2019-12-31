import ToastComponent from './Toast';
import { Toast, ToastContext } from '../contexts/ToastContext';
import { useContext } from 'react';

const ToastContainer = () => {
	const [ toasts, setToasts ] = useContext(ToastContext);

	return (
		<div style={{ position: 'fixed', top: '1em', right: '1em' }}>
			{/* <ToastComponent toast={new Toast('123', '123', '123')}/> */}
			{toasts.map((toast) => {
				return <ToastComponent key={toast.id} toast={toast} />;
			})}
		</div>
	);
};

export default ToastContainer;
