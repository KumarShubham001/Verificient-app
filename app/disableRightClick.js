$(document).ready(function () {
    $(document).bind("contextmenu", function (e) {
        return !1
    })
}), $(window).on("keydown", function (e) {
    return 123 != e.keyCode && ((!e.ctrlKey || !e.shiftKey || 73 != e.keyCode) && ((!e.ctrlKey || 73 !=
        e.keyCode) && void 0))
}), $(function () {
    $(document).keydown(function (e) {
        !e.ctrlKey && !e.metaKey || 65 != e.keyCode && 97 != e.keyCode || e.preventDefault()
    })
}), $(function () {
    $(document).keydown(function (e) {
        !e.ctrlKey && !e.metaKey || 83 != e.keyCode && 115 != e.keyCode || e.preventDefault()
    })

}), $(function () {
    $(document).keydown(function (e) {
        if (e.key == "Meta" || e.code == "MetaLeft" || e.keyCode == 91 || e.keyCode == 44) {
            console.log('boom')
            e.preventDefault();
        }
    })
});