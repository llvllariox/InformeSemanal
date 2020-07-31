function init_customJS() {

    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();

    });
    $(document).ready(function() {
        $('[data-toggle="tooltip"]').click(function() {
            $('[data-toggle="tooltip"]').tooltip("hide");


        });
    });
}

$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({
        'padding-right': scrollWidth
    });
}).resize();