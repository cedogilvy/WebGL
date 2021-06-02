/*****************
 *
 * Init MS cookie banner
 *
******************/
(function () {
    window.siteConsent = null;
    WcpConsent.init("en-US", "cookie-banner", function (err, _siteConsent) {
        if (err != undefined) {
            return err;
        } else {
            siteConsent = _siteConsent;
        }
    });
})();

/*****************
 *
 * Run through and manage cookies
 *
******************/

/* Get current consent items, loop through them, and allow the ones approved */
function setupCookies() {
    const savedCategories = siteConsent.getConsent();
    console.log(savedCategories);
    const selectedCats = [];

    Object.keys(savedCategories).forEach(function (item) {
        /* Skip past required because we don't need it */
        if ( item === 'Required' ) {
            return;
        }

        /* if approved, send unblocked function */
        if ( savedCategories[item] === true ) {
            if ( cookie_cats[item].length === 0 ) {
                return;
            }

            unblockCategory( cookie_cats[item] );
            selectedCats.push( item );
        }
    });

    /* if more than one are selected, check dual categories */
    if ( selectedCats.length === 2 ) {
        if ( selectedCats.includes('SocialMedia') && selectedCats.includes('Analytics') ) {
            unblockCategory( dual_cats.social_analytics );
        }

        if ( selectedCats.includes('SocialMedia') && selectedCats.includes('Advertising') ) {
            unblockCategory( dual_cats.ad_social );
        }

        if ( selectedCats.includes('Advertising') && selectedCats.includes('Analytics') ) {
            unblockCategory( dual_cats.ad_analytics );
        }
    }

    /* if all 3 are selected, unblock the all cats category */
    if ( selectedCats.length === 3  ) {
        unblockCategory( all_cats );
    }
}

/* Yett unblock function that loops through all items in a category and allows them */
function unblockCategory( cat ) {
    if ( cat.length === 0 ) {
        return;
    }

    cat.forEach( function( item ) {
        yett.unblock( item );
    });
}

/* Setup cookies when UHF callback is available */
WcpConsent.onInitCallback(setupCookies);
WcpConsent.onConsentChanged(setupCookies);
