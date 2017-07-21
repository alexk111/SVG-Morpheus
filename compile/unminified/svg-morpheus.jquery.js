/*!
 * SVG Morpheus v0.4
 * https://github.com/papablack/SVG-Morpheus
 *
 * Copyright (c) 2017 Papa Black
 * License: MIT
 *
 * Generated at Friday, July 21st, 2017, 2:49:30 PM
 */
(function() {
'use strict';

(function ($) {

    $.SVGMorpheus = {
        options: function (options) {
            var opts = {
                action: 'queue'
            };

            return $.extend(opts, options);
        },
        instantize: function (element) {

            var $this = this;

            if (element.nodeName.toUpperCase() !== 'SVG') {
                element = element.getSVGDocument();
                element = element.getElementsByTagName('svg')[0];
            }

            var elementIds = [];

            for (var i = 0; i <= element.childNodes.length - 1; i++) {
                var groupNode = element.childNodes[i];

                if (groupNode.nodeName.toUpperCase() === 'G') {

                    var genId = 'shape-id-' + $this.uniqueId();

                    groupNode.id = genId;
                    groupNode.style.display = 'none';

                    elementIds.push(genId);

                }
            }

            return {
                object: new SVGMorpheus(element),
                data: {
                    groupIds: elementIds
                }
            };
        },
        uniqueId: function () {
            var date = Date.now();

            // If created at same millisecond as previous
            if (date <= this.uniqueId.previous) {
                date = ++this.uniqueId.previous;
            } else {
                this.uniqueId.previous = date;
            }

            return date;
        }
    };

    $.fn.SVGMorpheus = function (options) {

        if (typeof options == 'undefined') {
            options = {};
        }

        var $tools = $.SVGMorpheus;

        var opts = new $tools.options(options);

        this.each(function () {

            var element = $(this)[0];

            var morpheusInitData = $tools.instantize(element);

            var morpheusObject = morpheusInitData.object;
            var morpheusData = morpheusInitData.data;

            switch (opts.action) {

                case 'queue' :
                    morpheusObject.queue(
                        morpheusData.groupIds,
                        opts
                    );
                    break;
                case 'scrollProgress':

                    var shapeIndex = typeof opts.shapeIndex == 'undefined' ? 0 : opts.shapeIndex;
                    morpheusObject.setupAnimationBase(morpheusData.groupIds[shapeIndex]);
                    morpheusObject.handleScroll(morpheusData.groupIds[shapeIndex]);

                    $(document).scroll(function (e) {
                        morpheusObject.handleScroll(morpheusData.groupIds[shapeIndex]);
                    });
                    break;

                default:
                    break;
            }
        });

    };

}(jQuery));
}());