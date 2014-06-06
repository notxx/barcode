(function($) {
if (!$ || !$.fn) return;

var verify = {};
verify.GTIN = function(code) {
	if (!code || !/^\d+$/.test(code)) { // is not numeric
		return false;
	}
	switch (code.length) {
	case 8:
		code = "000000" + code;
		break;
	case 12:
		code = "00" + code;
		break;
	case 13:
		code = "0" + code;
		break;
	case 14:
		break;
	default: // wrong number of digits
		return false;
	}
	var sum = 0;
	for (var i = 0; i < 14; i += 2) {
		sum += parseInt(code[i]) * 3;
	}
	for (var i = 1; i < 14; i += 2) {
		sum += parseInt(code[i]);
	}
	return (sum % 10 == 0);
};

var defaults = {
	lag : 30,
	autoNext : true,
	verify : false
};

var handler = {};
handler.focusable = function(e) {
	var self = $(this), 
		barcode = self.data("barcode"), 
		options = self.data("barcode.options");
//	console.log(e);
	if (e.keyCode == 13) {
		e.preventDefault(); // 阻止提交
		if ($.isFunction(options.verify) && // 进行验证
				!options.verify(self.val())) {
			this.select();
			return self.addClass("ui-state-error");
		}
		self.removeClass("ui-state-error");
		if (options.autoNext) { // 跳转焦点
			var focusables = $(":focusable"),
				index = focusables.index(this),
				next = focusables.eq(index + 1).length ? focusables.eq(index + 1) : focusables.eq(0);
			next.focus();
		}
	}
};
handler.unfocusable = function(e) {
	var self = $(this), 
		barcode = self.data("barcode"), 
		options = self.data("barcode.options");
	var la = barcode.lastAccess, 
		val = barcode.val || "",
		now = barcode.lastAccess = Date.now();
//	console.log(now - la);
	if (!la || now - la < options.lag) { // 扫码器比人快
		barcode.val = val + String.fromCharCode(e.keyCode);
	} else {
		delete barcode.lastAccess;
		delete barcode.val; // 清空记录
		return;
	}
//	console.log(now - la, val);
	if (e.keyCode == 13) {
		delete barcode.lastAccess;
		delete barcode.val; // 清空记录
//		console.log(barcode);
		e.preventDefault(); // 阻止提交
		if ($.isFunction(options.verify) && // 进行验证
				!options.verify(val)) {
			return self.addClass("ui-state-error");
		}
		self.removeClass("ui-state-error");
		if ($.isFunction(options.complete)) { options.complete(val, this); }
		// 不跳转焦点
	}
};


$.fn.barcode = function(options) {
//	console.log(this);
	if (!this.length) return;
	if (typeof options === "object")
		options = $.extend({}, defaults, options);
	else
		options = $.extend({}, defaults);
	if (options.verify === "UPC" || options.verify === "EAN" ||
			options.verify === "GTIN") {
		options.verify = verify.GTIN;
	}
	this.data("barcode", {}); // runtime sandbox
	this.data("barcode.options", options);
	if (this.is(":input")) {
		this.on("focus click", function() { this.select(); });
		this.on("keypress", handler.focusable);
	} else {
		this.on("keypress", handler.unfocusable);
	}
};

})(jQuery);