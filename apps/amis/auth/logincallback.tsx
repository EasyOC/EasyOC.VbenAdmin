import authService from 'route/auth/authService';
export function bootstrap() {
    authService.completeLogin().then(() => {
        if (window.opener) {
            if (window.localStorage.getItem('needReload') == '1') {
                // window.localStorage.removeItem('needReload');
                window.opener.location.reload();
            }
            window.close();
        }
    });
}
