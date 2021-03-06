/**
 * Adds o-tracking code to pages
 * @see http://registry.origami.ft.com/components/o-tracking
 */

'use strict';

// Templates
// Taken from https://github.com/Financial-Times/o-tracking#full-example
const ctmStyles = `
  <!-- Add CTM styles -->
  <style type="text/css" id="ctm-styles">
    /* Hide any enhanced experience content when in core mode, and vice versa. */
    .core .o--if-js,
    .enhanced .o--if-no-js { display: none !important; }
  </style>`;

const ctmScript = `
  <!-- Add CTM check -->
  <script id="ctm">
      var cutsTheMustard = ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window);
      if (cutsTheMustard) {
      // Swap the 'core' class on the HTML element for an 'enhanced' one
      // We're doing it early in the head to avoid a flash of unstyled content
      document.documentElement.className = document.documentElement.className.replace(/\bcore\b/g, 'enhanced');
      }
  </script>`;

const polyfillScript = `
  <!-- Add Polyfil service -->
  <script id="polyfill-service" src="https://cdn.polyfill.io/v1/polyfill.min.js"></script>`;

const oTrackingScript = uuid => `
  <!-- INIT and make a page request -->
  <script id="o-tracking">
      function oTrackinginit() {
          // oTracking
          var oTracking = Origami['o-tracking'];
          var config_data = {
              server: 'https://spoor-api.ft.com/px.gif',
              context: {
                  product: 'shorthand-ceros'
              },
              user: {
                  ft_session: oTracking.utils.getValueFromCookie(/FTSession=([^;]+)/)
              }
          }
          // Setup
          oTracking.init(config_data);
          // Page
          oTracking.page({
              content: {${uuid ? `
                  uuid: '${uuid}',` : ''}
                  asset_type: 'page'
              }
          });
      }
      if (cutsTheMustard) {
          var o = document.createElement('script');
          o.async = o.defer = true;
          o.src = 'https://build.origami.ft.com/v2/bundles/js?modules=o-tracking';
          var s = document.getElementsByTagName('script')[0];
          if (o.hasOwnProperty('onreadystatechange')) {
              o.onreadystatechange = function() {
                  if (o.readyState === "loaded") {
                      oTrackinginit();
                  }
              };
          } else {
              o.onload = oTrackinginit;
          }
          s.parentNode.insertBefore(o, s);
      }
  </script>`;

const ctmFallback = `
  <!-- Add fallback if browsers don't cut the mustard -->
  <div class="o-tracking o--if-no-js" data-o-component="o-tracking">
    <div style="background:url('https://spoor-api.ft.com/px.gif?data=%7B%22category%22:%22page%22,%20%22action%22:%22view%22,%20%22system%22:%7B%22apiKey%22:%22qUb9maKfKbtpRsdp0p2J7uWxRPGJEP%22,%22source%22:%22o-tracking%22,%22version%22:%221.0.0%22%7D,%22context%22:%7B%22product%22:%22shorthand-ceros%22,%22content%22:%7B%22asset_type%22:%22page%22%7D%7D%7D');"></div>
  </div>`;

/**
 * Default method. Appends above templates to DOM.
 * @param  {Cheerio} $ Loaded Cheerio DOM object
 * @return {Cheerio}   Modified Cheerio DOM object
 */
module.exports = ($, args) => {
  const uuid = args && Object.prototype.hasOwnProperty.call(args, 'uuid') ? args.uuid : false;
  $('head').append(ctmStyles);
  $('head').append(ctmScript);
  $('head').append(polyfillScript);
  $('head').append(oTrackingScript(uuid));
  $('body').prepend(ctmFallback);

  return $;
};
