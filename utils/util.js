/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} inFormat 输入格式
 * @param  {String} outFormat 输出格式
 * @return {String}        格式化过后的时间
 */

function timeChange(source, inFormat, outFormat) {
    var checkTime = function (time) {
        if (time < 10) {
            time = "0" + time;
        };
        return time;
    };
    switch (inFormat) {
        case 'Y-m-d H:i:s':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4], source[5], source[6], source[7]);
            break;
        case 'Y-m-d H:i':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4], source[5], source[6]);
            break;
        case 'Y-m-d':
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
            source = source.match(reg);
            source = new Date(source[1], source[3] - 1, source[4]);
            break;
        case 'timestamp':
            source = new Date(parseInt(source) * 1000);
            break;
    };
    switch (outFormat) {
        case 'Y-m-d H:i:s':
            return source.getFullYear() + '-'
                + checkTime(source.getMonth() + 1)
                + '-'
                + checkTime(source.getDate())
                + ' '
                + checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes())
                + ':'
                + checkTime(source.getSeconds());
            break;
        case 'Y-m-d H:i':
            return source.getFullYear() + '-'
                + checkTime(source.getMonth() + 1)
                + '-'
                + checkTime(source.getDate())
                + ' '
                + checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes());
            break;
        case 'Y-m-d':
            return source.getFullYear() + '-'
                + checkTime(source.getMonth() + 1)
                + '-'
                + checkTime(source.getDate());
            break;
        case 'Y.m.d':
            return source.getFullYear() + '.'
                + checkTime(source.getMonth() + 1)
                + '.'
                + checkTime(source.getDate());
            break;
        case 'm-d H:i':
            return checkTime(source.getMonth() + 1)
                + '-'
                + checkTime(source.getDate())
                + ' '
                + checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes());
            break;
        case 'm月d日 H:i':
            return checkTime(source.getMonth() + 1)
                + '月'
                + checkTime(source.getDate())
                + '日 '
                + checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes());
            break;
        case 'm-d':
            return checkTime(source.getMonth() + 1)
                + '-'
                + checkTime(source.getDate());
            break;
        case 'm.d':
            return checkTime(source.getMonth() + 1)
                + '.'
                + checkTime(source.getDate());
            break;
        case 'm.d H:i':
            return checkTime(source.getMonth() + 1)
                + '.'
                + checkTime(source.getDate())
                + ' '
                + checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes());
            break;
        case 'H:i':
            return checkTime(source.getHours())
                + ':'
                + checkTime(source.getMinutes());
            break;
        case 'timestamp':
            return parseInt(source.getTime() / 1000);
            break;
        case 'newDate':
            return source;
            break;
        case 'Y/m/d':
            return source.getFullYear() + '/'
                + checkTime(source.getMonth() + 1)
                + '/'
                + checkTime(source.getDate());
            break;
    };
}

/**
 * offetHeight  滚动计算部分到顶部距离
 * scrollTop   滚动高度
 * height      每个模块的高度
 * colunm      列数
**/

function countIndex(offetHight, scrollTop, height, colunm) {
    // 单例获取屏幕宽度比
    if (!countIndex.pix) {
        try {
            let res = wx.getSystemInfoSync()
            countIndex.pix = res.windowWidth / 375
        } catch (e) {
            countIndex.pix = 1
        }
    }
    let scroll = scrollTop - offetHight * countIndex.pix
    let hei = height * countIndex.pix
    return scroll > 0 ? Math.floor(scroll / hei) * colunm : 0
}


function showLoading(){
    wx.showLoading({
        title: "正为您快速加载中"
    })
}

module.exports = { 
    timeChange,
    showLoading,
    countIndex
}

