import authService from "route/auth/authService";
export function bootstrap() {
    authService.completeLogin().then(()=>{
        if(window.opener){
            window.close();
        }
    })
}
