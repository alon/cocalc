####################################################
#
# Client device features and capabilities. 
#
####################################################

isMobile = exports.isMobile =
    Android    : () -> if navigator.userAgent.match(/Android/i) then true else false
    BlackBerry : () -> if navigator.userAgent.match(/BlackBerry/i) then true else false
    iOS        : () -> if navigator.userAgent.match(/iPhone|iPad|iPod/i) then true else false
    Windows    : () -> if navigator.userAgent.match(/IEMobile/i) then true else false
    any        : () -> if (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows()) then true else false

exports.IS_MOBILE = exports.isMobile.any()