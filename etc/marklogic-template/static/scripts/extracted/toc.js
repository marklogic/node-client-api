// Extracted from layout.html
		$( function () {
			$( "[id*='$']" ).each( function () {
				var $this = $( this );

				$this.attr( "id", $this.attr( "id" ).replace( "$", "__" ) );
			} );

			$( "#toc" ).toc( {
				anchorName  : function ( i, heading, prefix ) {
					return $( heading ).attr( "id" ) || ( prefix + i );
				},
				selectors   : "h1,h2,h3,h4",
				showAndHide : false,
				scrollTo    : "100px"
			} );

			$( "#toc>ul" ).addClass( "nav nav-pills nav-stacked" );
			$( "#main span[id^='toc']" ).addClass( "toc-shim" );
			$( '.dropdown-toggle' ).dropdown();
//			$( ".tutorial-section pre, .readme-section pre" ).addClass( "sunlight-highlight-javascript" ).addClass( "linenums" );

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
					lang = "javascript";
				}

				if ( lang ) {

					$this
						.addClass( "sunlight-highlight-" + lang )
						.addClass( "linenums" )
						.html( example.html() );

				}
			} );

			Sunlight.highlightAll( {
				lineNumbers : true,
				showMenu : true,
				enableDoclinks : true
			} );
		} );
