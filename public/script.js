$( "#main" ).on("load", function() {
    $('#preload').hide();
    $('#main').fadeIn('slow');
});
$( "#main" ).on("error", function () {
    $(this).attr("src", "/error.jpg");
    $('#preload').hide();
    $('#main').fadeIn('slow');
});