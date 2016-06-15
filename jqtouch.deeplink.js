(function($) {
  if ($.jQTouch) {
    var DeepLink = function(jQTouch) {
      var defaults = {
	  PAGE_NOT_AVAILABLE: "The page you requested is not available on our mobile site.",
          VIEW_FULL_SITE: "Would you like to view the page on our full site?",
          redirectParam: 'redirect=false',
          targetTemplate: '{{ target }}',
          showTargetOnRedirect: true
        },

        addNoRedirect = function(url, param){
          var params = [param];
          if (url.indexOf('?') != -1) {
            url = url.split('?');
            url[1] = url[1].split('&');
            for (var i = 0; i < url[1].length; i++) {
              params.push(url[1][i]);
            }
            url = url[0];
          }
          return [url, params.join('&')].join('?');
        },

        deepLink = function(target, settings) {
          if (target) {
            var reDomain = /http[s]?:\/\/[^\/]+/i,
              localTarget = target.replace(reDomain, ""),
              loader = $('<form/>').attr('action', localTarget),
              hash = !!(localTarget.indexOf('#') > -1);
            settings = $.extend({}, defaults, settings);

            // append target to error message
            if (!!settings.showTargetOnRedirect && settings.VIEW_FULL_SITE.indexOf(settings.targetTemplate) == -1) {
              settings.VIEW_FULL_SITE = settings.VIEW_FULL_SITE + ' (' + settings.targetTemplate + ')';
            }
            if (localTarget && (!!hash || localTarget.indexOf("/index.htm") != 0)) {
              if ($.isFunction(settings['before'])) {
                settings.before();
              }
              jQTouch.submitForm(loader, function (success) {
                var message;
                if (!success) {
                  if (!target.match(reDomain)) {
                    alert(settings.PAGE_NOT_AVAILABLE);
                  } else {
                    message = settings.PAGE_NOT_AVAILABLE + ' ' + settings.VIEW_FULL_SITE.replace(settings.targetTemplate, target);
                    if (confirm(message)) {
                      target = addNoRedirect(target, settings.redirectParam);
                      location.assign(target);
                    }
                  }
                }
                if ($.isFunction(settings['after'])){
                  settings.after();
                }
                loader.remove();
              });
            }
          }
        };

      return {
        deepLink: deepLink
      };
    };
    $.jQTouch.addExtension(DeepLink);
  }
})(jQuery);
