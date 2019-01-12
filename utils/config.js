let env = {
    //开发环境
    test: {
        api: 'http://abc.fdj.oudewa.cn/mini/'   
    },
    //线上环境
    online: {
        api: ''  
    }
};

module.exports = env['test'];