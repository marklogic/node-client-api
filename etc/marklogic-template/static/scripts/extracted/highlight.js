$( function () {
    $( "[id*='$']" ).each( function () {
        var $this = $( this );

        $this.attr( "id", $this.attr( "id" ).replace( "$", "__" ) );
    } );

    $( ".tutorial-section pre, .readme-section pre" ).each( function () {
        var $this = $( this );

        var example = $this.find( "code" );
        exampleText = example.html();
        var lang = /{@lang (.*?)}/.exec( exampleText );
        if ( lang && lang[1] ) {
            exampleText = exampleText.replace( lang[0], "" );
            example.html( exampleText );
            lang = lang[1];
        } else {
            var langClassMatch = example.parent()[0].className.match(/lang\-(\S+)/);
            lang = langClassMatch ? langClassMatch[1] : "javascript";
        }

        if ( lang ) {

            $this
            .addClass( "sunlight-highlight-" + lang )
            .addClass( "linenums" )
            .html( example.html() );

        }
    } );

    Sunlight.highlightAll( {
        lineNumbers : true, // hardcoded for custom template
        showMenu : true,
        enableDoclinks : true
    } );

    $( "#toc" ).toc( {
        anchorName  : function ( i, heading, prefix ) {
            var id = $( heading ).attr( "id" );
            return id && id.replace(/\~/g, '-inner-').replace(/\./g, '-static-') || ( prefix + i );
        },
        selectors   : "#toc-content h1,#toc-content h2,#toc-content h3,#toc-content h4",
        showAndHide : false,
                navbarOffset: 10,
        smoothScrolling: true
    } );

    $( "#toc>ul" ).addClass( "nav nav-pills nav-stacked" );
    $( "#main span[id^='toc']" ).addClass( "toc-shim" );
    $( '.dropdown-toggle' ).dropdown();

    $( "table" ).each( function () {
      var $this = $( this );
      $this.addClass('table');
    } );

} );
