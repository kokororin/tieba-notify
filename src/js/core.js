var TiebaNotify = {

    time: 2000,
    userinfo: null,
    numbers: null,
    sum: 0,
    links: null,
    firstRun: true,
    isLogin: false,

    getUserInfo: function() {
        var that = this;
        var message = "success";

        jQuery.ajax({
            method: "GET",
            url: "http://tieba.baidu.com/f/user/json_userinfo",
            async: false,
            timeout: 30000,
            success: function(data) {
                try {
                    that.userinfo = JSON.parse(data);
                    that.isLogin = true;
                    that.links = [
                        "http://tieba.baidu.com/i/sys/jump?u=" + that.userinfo.data.user_portrait + "&type=fans",
                        "http://tieba.baidu.com/i/sys/jump?u=" + that.userinfo.data.user_portrait + "&type=replyme",
                        "http://tieba.baidu.com/i/sys/jump?u=" + that.userinfo.data.user_portrait + "&type=feature",
                        "http://tieba.baidu.com/i/sys/jump?u=" + that.userinfo.data.user_portrait + "&type=atme",
                        "http://tieba.baidu.com/pmc/recycle",
                        "https://passport.baidu.com/v2/?login"
                    ];
                } catch (e) {
                    message = "user format error.";
                }
            }
        });


        return message;
    },
    getMessageData: function() {
        var that = this;
        var response, num_arr = [],
            message = "success",
            sum = 0;
        if (!that.isLogin) {
            message = "user not logined.";
            return message;
        }
        jQuery.ajax({
            method: "GET",
            url: "http://message.tieba.baidu.com/i/msg/get_data?user=" + that.userinfo.data.user_portrait,
            async: false,
            dataType: "text",
            timeout: 30000,
            success: function(data) {
                if (data.indexOf("initItiebaMessage") != 0) {
                    message = 'response format error.';
                }

                response = data.replace(/initItiebaMessage\(\[/, "").replace(/\]\);/g, "").split(",");

                num_arr.push(response[0]);
                num_arr.push(response[3]);
                num_arr.push(response[4]);
                num_arr.push(response[8]);
                num_arr.push(response[9]);

                if (!(num_arr[0] || num_arr[1] || num_arr[2] || num_arr[3] || num_arr[4])) {
                    message = 'no data.';
                }
                that.numbers = num_arr;

                for (var i = 0; i < num_arr.length; i++) {
                    sum += parseInt(num_arr[i]);
                }
                that.sum = sum;
                chrome.browserAction.setBadgeText({
                    text: sum.toString()
                });

            }

        });

        return message;
    },
    process: function() {
        var that = this;
        if (that.firstRun) {
            msg = that.getUserInfo();
            if (msg != "success") {
                console.log(msg);
            }
            that.firstRun = false;
        }

        msg = that.getMessageData();
        if (msg != "success") {
            console.log(msg);
        }
    },
    init: function() {
        var that = this;
        that.time = parseInt(getOption('time')) * 100;
        that.process();
        setInterval(function() {
            that.process();
        }, that.time);
    }
};
