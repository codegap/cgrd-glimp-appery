/*
 * JS for detail generated by Appery.io
 *
 */

Appery.getProjectGUID = function() {
    return 'bb459362-af90-40c0-84be-fb89d688cc52';
}

function navigateTo(outcome, useAjax) {
    Appery.navigateTo(outcome, useAjax);
}

function adjustContentHeight() {
    Appery.adjustContentHeight();
}

function adjustContentHeightWithPadding() {
    Appery.adjustContentHeightWithPadding();
}

function setDetailContent(pageUrl) {
    Appery.setDetailContent(pageUrl);
}

Appery.AppPages = [{
    "name": "detail",
    "location": "detail.html"
}, {
    "name": "startScreen",
    "location": "startScreen.html"
}];

detail_js = function(runBeforeShow) { /* Object & array with components "name-to-id" mapping */
    var n2id_buf = {
        'glimpimage': 'detail_glimpimage'
    };

    if ("n2id" in window && window.n2id !== undefined) {
        $.extend(n2id, n2id_buf);
    } else {
        window.n2id = n2id_buf;
    }

    if (navigator.userAgent.indexOf("IEMobile") != -1) {
        //Fixing issue https://github.com/jquery/jquery-mobile/issues/5424 on Windows Phone
        $("div[data-role=page] div[data-role=footer]").css("bottom", "-36px");
    }

    if (Appery.getTargetPlatform == "I") {
        $.each(window.n2id, function(name, id) {
            var elApperyRole = $("#" + id).attr("data-role");
            if (elApperyRole != "appery_label" && elApperyRole != "appery_link") {
                var appleDataSelector = "#" + id + "[x-apple-data-detectors], #" + id + " [x-apple-data-detectors]";
                $(appleDataSelector).attr("x-apple-data-detectors", "false");
            }
        });
    }

    Appery.CurrentScreen = 'detail';

    /*
     * Nonvisual components
     */
    var datasources = [];

    /*
     * Events and handlers
     */

    // Before Show
    detail_beforeshow = function() {
        Appery.CurrentScreen = "detail";
        for (var idx = 0; idx < datasources.length; idx++) {
            datasources[idx].__setupDisplay();
        }
    }

    // On Load
    screen_9172_onLoad = detail_onLoad = function() {
        screen_9172_elementsExtraJS();
        setAttribute_('detail_glimpimage', 'src', localStorage.getItem('imgname'));
        $('[id="detail_glimpimage"]').refresh();

        // TODO fire device events only if necessary (with JS logic)
        detail_deviceEvents();
        detail_windowEvents();
        screen_9172_elementsEvents();
    }

    // screen window events
    screen_9172_windowEvents = detail_windowEvents = function() {

        $('#detail').bind('pageshow orientationchange', function() {
            adjustContentHeightWithPadding();
        });

    }

    // device events
    detail_deviceEvents = function() {

        document.addEventListener("deviceready", function() {

        });
    }

    // screen elements extra js
    screen_9172_elementsExtraJS = detail_elementsExtraJS = function() {
        // screen (detail) extra code

    }

    // screen elements handler
    screen_9172_elementsEvents = detail_elementsEvents = function() {

        $("a :input,a a,a fieldset label").live({
            click: function(event) {
                event.stopPropagation();
            }
        });

        $('#detail_mobilecontainer [name="glimpimage"]').die().live({
            click: function() {
                if (!$(this).attr('disabled')) {
                    Appery.navigateTo('startScreen', {
                        transition: 'fade',
                        reverse: false
                    });

                }
            },
        });

    }

    $("#detail").die("pagebeforeshow").live("pagebeforeshow", function(event, ui) {
        detail_beforeshow();
    });

    if (runBeforeShow) {
        detail_beforeshow();
    } else {
        detail_onLoad();
    }

}

$("#detail").die("pageinit").live("pageinit", function(event, ui) {
    Appery.processSelectMenu($(this));
    detail_js();
});