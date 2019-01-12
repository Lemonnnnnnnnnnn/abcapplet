let env = {
    //开发环境
    test: {
        api: 'http://abc.fdj.oudewa.cn/mini/',
        loginPath: 'auth/loginpost'  
    },
    //线上环境
    online: {
        api: '',
        loginPath: 'auth/loginpost'
    }
};

module.exports = env['test'];