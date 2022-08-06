/**
 * @file entry of this example.
 */
import React from 'react';
import ReactDom from 'react-dom'; 
import authService from 'route/auth/authService';
import App from './App';

export function bootstrap(mountTo: HTMLElement) {
    // new login().login().then(() => {
    //     console.log("authService.completeLogin()");
    // })
    // authService.signinPopup();
    ReactDom.render(<App />, mountTo);
}
