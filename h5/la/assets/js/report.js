$(function () {
    //get token
    var token = GetCookie('la_token');

    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    //Get Asset Balance Report
    // var sum_la_base_amount = '', sum_us_base_amount = '', sum_ba_base_amount = '', sum_ca_base_amount = '',
    //     ba_register_count, ca_register_count, us_register_count, tr = '';
    function GetAssetsReportFun() {
        var sum_la_base_amount = '', sum_us_base_amount = '', sum_ba_base_amount = '', sum_ca_base_amount = '',
            ba_register_count, ca_register_count, us_register_count, tr = '';
        GetAssetsReport(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                sum_us_base_amount = data.sum_us_base_amount;
                sum_ba_base_amount = data.sum_ba_base_amount;
                sum_ca_base_amount = data.sum_ca_base_amount;
                sum_la_base_amount = Number(sum_us_base_amount) + Number(sum_ba_base_amount) + Number(sum_ca_base_amount);
                ba_register_count = data.ba_register_count;
                ca_register_count = data.ca_register_count;
                us_register_count = data.us_register_count;
                if (sum_us_base_amount == null) {
                    sum_us_base_amount = 0;
                }
                if (sum_ba_base_amount == null) {
                    sum_ba_base_amount = 0;
                }
                if (sum_ca_base_amount == null) {
                    sum_ca_base_amount = 0;
                }
                if (sum_la_base_amount == null) {
                    sum_la_base_amount = 0;
                }
                if (ba_register_count == 0) {
                    ba_register_count = 0;
                }
                if (ca_register_count == 0) {
                    ca_register_count = 0;
                }
                if (us_register_count == 0) {
                    us_register_count = 0;
                }
                tr += '<tr>' +
                    '<td><span class="sum_la_base_amount">' + sum_la_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_us_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_ba_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_la_base_amount">' + sum_ca_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '</tr>';
                $('#amount_report').html(tr);
                var trInfo = '';
                var sum_us_recharge_base_amount = data.sum_us_recharge_base_amount,
                    sum_us_withdraw_base_amount = data.sum_us_withdraw_base_amount,
                    sum_ba_recharge_base_amount = data.sum_ba_recharge_base_amount,
                    sum_ba_withdraw_base_amount = data.sum_ba_withdraw_base_amount,
                    sum_ca_recharge_base_amount = data.sum_ca_recharge_base_amount,
                    sum_ca_withdraw_base_amount = data.sum_ca_withdraw_base_amount;

                if (sum_us_recharge_base_amount == null) {
                    sum_us_recharge_base_amount = 0
                }
                if (sum_us_withdraw_base_amount == null) {
                    sum_us_withdraw_base_amount = 0
                }
                if (sum_ba_recharge_base_amount == null) {
                    sum_ba_recharge_base_amount = 0
                }
                if (sum_ba_withdraw_base_amount == null) {
                    sum_ba_withdraw_base_amount = 0
                }
                if (sum_ca_recharge_base_amount == null) {
                    sum_ca_recharge_base_amount = 0
                }
                if (sum_ca_withdraw_base_amount == null) {
                    sum_ca_withdraw_base_amount = 0
                }

                trInfo += '<tr>' +
                    '<td><span class="sum_us_recharge_base_amount">' + sum_us_recharge_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_us_withdraw_base_amount">' + sum_us_withdraw_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_ba_recharge_base_amount">' + sum_ba_recharge_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_ba_withdraw_base_amount">' + sum_ba_withdraw_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_ca_recharge_base_amount">' + sum_ca_recharge_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '<td><span class="sum_ca_withdraw_base_amount">' + sum_ca_withdraw_base_amount + '</span><span class="base_type">BTC</span></td>' +
                    '</tr>';
                $('#amount_reportInfo').html(trInfo);

                DonutFun(us_register_count, ba_register_count, ca_register_count);
                var dataChartObj = {}, dataChart = [];
                dataChartObj.y = new Date().Format('yyyy-MM-dd'),
                dataChartObj.u = sum_us_base_amount,
                dataChartObj.b = sum_ba_base_amount,
                dataChartObj.c = sum_ca_base_amount;
                dataChart.push(dataChartObj);
                LineFun(dataChart);
            }
        }, function (response) {
            LayerFun(response.errcode);
        });
    }

    GetAssetsReportFun();

    // setInterval(GetAssetsReportFun, 5000);

    /* MORRIS DONUT CHART
			----------------------------------------*/

    //扇形图
    function DonutFun(us_register_count, ba_register_count, ca_register_count) {
        Morris.Donut({
            element: 'morris-donut-chart',
            data: [{label: "Users", value: us_register_count},
                {label: "Digital Currency Agents", value: ba_register_count},
                {label: "Legal Currency Agents", value: ca_register_count}],
            colors: ['#A6A6A6', '#414e63', '#e96562'],
            resize: true
            // formatter: function (y) { return y + "%" }
        });
    }

    //折线图
    // var user = 2000, ba = 3000, ca = 4000;
    //     var dataChart = [{ y: '2018', u: user,  b: ba, c: ca}];
    function LineFun(dataChart) {
        Morris.Line({
            element: 'morris-line-chart',
            data: dataChart,
            xkey: 'y',
            ykeys: ['u', 'b', 'c'],
            labels: ['user amount', 'ba amount', 'ca amount'],
            fillOpacity: 0.6,
            hideHover: 'auto',
            smooth: true,
            behaveLikeLine: true,
            resize: true,
            pointFillColors: ['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors: ['green', 'red', 'blue']
        });
    }
    // LineFun(dataChart);
});