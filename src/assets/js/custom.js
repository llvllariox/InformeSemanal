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