/**
 * Created by lizhe on 2016/3/21.
 */

window.onload = function() {
    var btn = document.getElementById("submitBtn");

    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
        function(tabs) {
            var domain = document.getElementsByName("domain");
            var curUrl = tabs[0].url;
            var patt = new RegExp("^((http|https)://[^/]+/)", 'i');
            var res = patt.exec(curUrl);

            domain[0].value = res ? res[0] : "";
        }
    );

    btn.onclick = function() {
        submit();
    }
};

function submit() {
    var cookies = document.getElementsByName("cookies")[0].value;
    var domain = document.getElementsByName("domain")[0].value;

    str2JSON(cookies, domain);
}

function str2JSON(data, domain) {
    var str = data;
    var strs = str.split('\n');   //TODO: Windows && Linux
    var res = [];

    for(var key in strs) {
        var cookie = {
            url: domain,
            path: "/"
        };
        var tempStr = strs[key];
        strs[key] = tempStr.replace(' ', '');
        strs[key] = tempStr.replace('\t', '');
        var kv = strs[key].split('=');

        if(kv.length == 2) {
            cookie['name'] = kv[0];
            cookie['value'] = kv[1];
        }else if(kv.length == 1 && kv[0].length > 0) {
            cookie['name'] = kv[0];
            cookie['value'] = '';
        } else {
            continue;
        }

        setCookie(cookie);
        res.push(cookie);
    }
    res = JSON.stringify(res);
    return res;
}

function setCookie(obj) {
    chrome.cookies.set(obj, function(cookie) {
        console.log(cookie);
    });
}