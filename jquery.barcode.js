(function(jQuery) {
if (!jQuery || !jQuery.fn) return;
jQuery.fn.barcode = function() {
//	console.log(this);
	if (!this.length) return;
	var self = this;
	this.on("keypress", function(e) { 
//		console.log(e);
	if (e.keyCode == 13) {
		e.preventDefault();
		var focusables = $(":focusable"),
			index = focusables.index(this),
			next = focusables.eq(index + 1).length ? focusables.eq(index + 1) : focusables.eq(0);
		next.focus();
	} });
}
})(jQuery);