var TiebaNotify = function() {
    this.init();
}

TiebaNotify.prototype.time = 25000;
TiebaNotify.prototype.userinfo = null;
TiebaNotify.prototype.numbers = null;
TiebaNotify.prototype.sum = 0;
TiebaNotify.prototype.links = null;
TiebaNotify.prototype.firstRun = true;


TiebaNotify.prototype.init = function() {}

TiebaNotify.prototype.getUserInfo = function() {
    var _this = this;
    var message = "success";

    $.ajax({
        method: "GET",
        url: "http://tieba.baidu.com/f/user/json_userinfo",
        async: false,
        timeout: 30000,
        success: function(data) {
            try {
                _this.userinfo = JSON.parse(data);
                _this.links = [
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=fans",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=replyme",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=feature",
                    "http://tieba.baidu.com/i/sys/jump?u=" + _this.userinfo.data.user_portrait + "&type=atme",
                    "http://tieba.baidu.com/pmc/recycle"
                ];
            } catch(e) {
                message = "user format error.";
            }

        }
    });


    return message;
}

TiebaNotify.prototype.getMessageData = function() {
    var _this = this;
    var response, num_arr = [],
        message = "success",
        sum = 0;

    $.ajax({
        method: "GET",
        url: "http://message.tieba.baidu.com/i/msg/get_data?user=" + _this.userinfo.data.user_portrait,
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
            _this.numbers = num_arr;

            for (var i = 0; i < num_arr.length; i++) {
                sum += parseInt(num_arr[i]);
            }
            _this.sum = sum;
            chrome.browserAction.setBadgeText({
                text: sum.toString()
            });

        }

    });

    return message;
}

TiebaNotify.prototype.process = function() {
    var _this = this;
    if (_this.firstRun) {
        msg = _this.getUserInfo();
        if (msg != "success") {
            console.log(err);
        }
        _this.firstRun = false;
    }

    msg = _this.getMessageData();
    if (msg != "success") {
        console.log(msg);
    }

}

TiebaNotify.prototype.run = function() {
    var _this = this;
    _this.process();
    setInterval(function() {
        _this.process();
    }, _this.time);
}
