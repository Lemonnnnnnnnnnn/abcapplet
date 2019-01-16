let env = {
    //开发环境
    test: {
        api: 'http://abc.fdj.oudewa.cn/mini/',
        loginPath: 'auth/loginpost',
        closeIcon: '/images/common/close.png'
    },
    //线上环境
    online: {
        api: 'https://api.gongyuabc.com/mini/',
        loginPath: 'auth/loginpost',
        closeIcon: '/images/common/close.png'
    }
};

module.exports = env['online'];