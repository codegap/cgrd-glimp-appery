String.prototype.trim = String.prototype.trim || function () {
    if (!this) return this;
    return this.replace(/^\s+|\s+$/g, "");
};

function showSpinner(directOptions) {
    var loaderOptions;
    if (directOptions != undefined && $.type(directOptions) === "object") {
        loaderOptions = directOptions;
    } else {
        if (Appery.loaderOptions != undefined && $.type(Appery.loaderOptions) === "object") {
            loaderOptions = Appery.loaderOptions;
        }
    }
    if (loaderOptions != undefined) {
        $.mobile.loading('show', loaderOptions);
    } else {
        $.mobile.loading('show');
    }
}

function hideSpinner() {
    $.mobile.loading('hide');
}

function resetActivePageContentHeight() {
    var aPage = $("." + $.mobile.activePageClass),
        aPageContent = aPage.find(".ui-content"),
        aPageHeader = aPage.find(".ui-header"),
        aPageFooter = aPage.find(".ui-footer"),
        h = $.mobile.getScreenHeight();

    // It's OK with dialogue, we don't need extra sizing
    if (aPage.is("[data-role='dialog']")) return;

    // Considering page paddings and borders
    h -= parseFloat(aPage.css("padding-top"));
    h -= parseFloat(aPage.css("padding-bottom"));
    h -= parseFloat(aPage.css("border-top-width"));
    h -= parseFloat(aPage.css("border-bottom-width"));

    // Considering page content paddings and borders
    h -= parseFloat(aPageContent.css("padding-top"));
    h -= parseFloat(aPageContent.css("padding-bottom"));
    h -= parseFloat(aPageContent.css("border-top-width"));
    h -= parseFloat(aPageContent.css("border-bottom-width"));

    // Considering inline page header height, paddings and borders
    if (!aPageHeader.is(".ui-header-fixed")) {
        h -= parseFloat(aPageHeader.height());
        h -= parseFloat(aPageHeader.css("padding-top"));
        h -= parseFloat(aPageHeader.css("padding-bottom"));
        h -= parseFloat(aPageHeader.css("border-top-width"));
        h -= parseFloat(aPageHeader.css("border-bottom-width"));
    }

    // Considering inline page footer height, paddings and borders
    if (!aPageFooter.is(".ui-footer-fixed")) {
        h -= parseFloat(aPageFooter.height());
        h -= parseFloat(aPageFooter.css("padding-top"));
        h -= parseFloat(aPageFooter.css("padding-bottom"));
        h -= parseFloat(aPageFooter.css("border-top-width"));
        h -= parseFloat(aPageFooter.css("border-bottom-width"));
    }

    aPage.find(".ui-content").css("min-height", h);
}

$.mobile.document.bind("pageshow", resetActivePageContentHeight);
$.mobile.window.bind("throttledresize", resetActivePageContentHeight);

// Replacing native jQuery show/hide logic to handle mobileinput
(function () {

    var nativeHide = jQuery.fn.hide;
    jQuery.fn.hide = function () {
        if (this.prop('tagName') == 'INPUT' && this.parent(".ui-input-text").length > 0) {
            return nativeHide.apply(this.parent(".ui-input-text").parent(), arguments);
        } else if (this.prop('tagName') == 'A' && this.attr('data-role') == "button") {
            this.css("display", "none");
        } else if (this.prop('tagName') == 'DIV' && this.attr('data-role') == "navbar") {
			if (this.css("display") == "none") {
				return this;
			}
			var nbp = this.parent()
			if (nbp.prop('tagName') == 'DIV' && nbp.attr('data-role') == "header") {
				nbp = nbp.parent();
				var nbh = this.height();
				if (nbp.attr('data-role') == "page") {
					var nbpt = parseInt(nbp.css("padding-top")) - nbh;;
					nbp.css("padding-top", nbpt + "px");
				}
			}
			return nativeHide.apply(this, arguments);
        } else {
            return nativeHide.apply(this, arguments);
        }
    };

    var nativeShow = jQuery.fn.show;
    jQuery.fn.show = function () {
        if (this.prop('tagName') == 'INPUT' && this.parent(".ui-input-text").length > 0) {
            return nativeShow.apply(this.parent(".ui-input-text").parent(), arguments);
        } else if (this.prop('tagName') == 'A' && this.attr('data-role') == "button") {
            if (this.hasClass("ui-btn-left") || this.hasClass("ui-btn-right") || this.hasClass("ui-btn-inline")) {
                this.css("display", "inline-block");
            } else {
                this.css("display", "block");
            }

        } else if (this.prop('tagName') == 'DIV' && this.attr('data-role') == "navbar") {
			if (this.css("display") != "none") {
				return this;
			}
			var result = nativeShow.apply(this, arguments);
			var nbp = this.parent()
			if (nbp.prop('tagName') == 'DIV' && nbp.attr('data-role') == "header") {
				nbp = nbp.parent();
				var nbh = this.height();
				if (nbp.attr('data-role') == "page") {
					var nbpt = parseInt(nbp.css("padding-top")) + nbh;;
					nbp.css("padding-top", nbpt + "px");
				}
			}
			return result;
        } else {
            return nativeShow.apply(this, arguments);
        }
    };

})();
