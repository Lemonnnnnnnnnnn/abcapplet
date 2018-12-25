const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];

for (let i = 2015; i < 2050; i++) {
    years.push(`${i}年`);
}

for (let i = 1; i < 13; i++) {
    months.push(`${i}月`);
}

for (let i = 1; i < 32; i++) {
    days.push(`${i}日`);
}

for (let i = 0; i < 24; i++) {
    hours.push(`${i}时`);
}

for (let i = 0; i < 60; i++) {
    minutes.push(`${i}分`);
}
class Time {
    static years = years;
    static months = months;
    static days = days;
    static hours = hours;
    static minutes = minutes;
    static findCurrentIndex() {
        const date = new Date();
        let year = date.getFullYear() + "年",
            month = (date.getMonth() + 1) + "月",
            day = date.getDate() + "日",
            hour = date.getHours() + "时",
            minute = date.getMinutes() + "分";
        let yearIndex = Time.years.findIndex((value, index, arr) => {
                return value == year;
            }),
            monthIndex = Time.months.findIndex((value, index, arr) => {
                return value == month;
            }),
            dayIndex = Time.days.findIndex((value, index, arr) => {
                return value == day;
            }),
            hourIndex = Time.hours.findIndex((value, index, arr) => {
                return value == hour;
            }),
            minuteIndex = Time.minutes.findIndex((value, index, arr) => {
                return value == minute;
            });
       
        let current = [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex];
        return [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex];
    }

    static timeChange(source, inFormat, outFormat) {
        var checkTime = function(time) {
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
                return source.getFullYear() + '-' +
                    checkTime(source.getMonth() + 1) +
                    '-' +
                    checkTime(source.getDate()) +
                    ' ' +
                    checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes()) +
                    ':' +
                    checkTime(source.getSeconds());
                break;
            case 'Y-m-d H:i':
                return source.getFullYear() + '-' +
                    checkTime(source.getMonth() + 1) +
                    '-' +
                    checkTime(source.getDate()) +
                    ' ' +
                    checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes());
                break;
            case 'Y-m-d':
                return source.getFullYear() + '-' +
                    checkTime(source.getMonth() + 1) +
                    '-' +
                    checkTime(source.getDate());
                break;
            case 'Y.m.d':
                return source.getFullYear() + '.' +
                    checkTime(source.getMonth() + 1) +
                    '.' +
                    checkTime(source.getDate());
                break;
            case 'm-d H:i':
                return checkTime(source.getMonth() + 1) +
                    '-' +
                    checkTime(source.getDate()) +
                    ' ' +
                    checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes());
                break;
            case 'm月d日 H:i':
                return checkTime(source.getMonth() + 1) +
                    '月' +
                    checkTime(source.getDate()) +
                    '日 ' +
                    checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes());
                break;
            case 'm-d':
                return checkTime(source.getMonth() + 1) +
                    '-' +
                    checkTime(source.getDate());
                break;
            case 'm.d':
                return checkTime(source.getMonth() + 1) +
                    '.' +
                    checkTime(source.getDate());
                break;
            case 'm.d H:i':
                return checkTime(source.getMonth() + 1) +
                    '.' +
                    checkTime(source.getDate()) +
                    ' ' +
                    checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes());
                break;
            case 'H:i':
                return checkTime(source.getHours()) +
                    ':' +
                    checkTime(source.getMinutes());
                break;
            case 'timestamp':
                return parseInt(source.getTime() / 1000);
                break;
            case 'newDate':
                return source;
                break;
            case 'Y/m/d':
                return source.getFullYear() + '/' +
                    checkTime(source.getMonth() + 1) +
                    '/' +
                    checkTime(source.getDate());
                break;
            case 'm':
                return source.getMonth() + 1;
                break;
            case 'd':
                return source.getDate();
                break;
        };
    }

    static format(list) {
        let currentYear = Time.years[list[0]].split("年")[0],
            currentMonth = Time.months[list[1]].split("月")[0],
            currentDay = Time.days[list[2]].split("日")[0],      //修改-1
            currentHour = Time.hours[list[3]].split("时")[0],
            currentMinute = Time.minutes[list[4]].split("分")[0];

        let time = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute}`;
        let stamp = Time.timeChange(time, 'Y-m-d H:i', 'timestamp');
        return stamp;
    }
}

export {
    Time
};