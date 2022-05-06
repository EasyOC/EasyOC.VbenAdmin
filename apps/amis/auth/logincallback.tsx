import authService from 'route/auth/authService';
export function bootstrap() {
    authService.completeLogin().then(() => {
        if (window.opener) {
            if (window.localStorage.getItem('needReload') == '1') {
                window.localStorage.removeItem('needReload');
                const returnUrl = window.localStorage.getItem('returnUrl');
                if (returnUrl) {
                    window.localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                // } else {
                //     window.opener.location.reload();
                }
            }
            // window.close();
        }
    });
}
