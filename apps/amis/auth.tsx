import login from "login";
import authService from "route/auth/authService";


export function bootstrap(mountTo: HTMLElement) {
    // new login().login().then(() => {
    //     console.log("authService.completeLogin()");
    // })
    authService.completeLogin().then(()=>{
        if(window.opener){
            window.close();
        }
    })
    // authService.login().then(() => {
    //     console.log("authService.completeLogin()");
    // }).catch(() => {
    //     console.log("authService.completeLogin()");
    // });
}
