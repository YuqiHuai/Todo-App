import React, { useState } from 'react';
import uuid from 'uuid/v4';

export class Toast {
    public id: string;
    public type: string;
    public title: string;
    public message: string;
    public dismissed: boolean;

    constructor(type: string, title: string, message: string) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.dismissed = false;
        this.id = uuid();
    }
}

export const ToastContext = React.createContext([]);

export const ToastsProvider = (props) => {
    const [toasts, setToasts] = useState([]);
    return (
        <ToastContext.Provider value={[toasts, setToasts]}>
            {props.children}
        </ToastContext.Provider>
    )
}