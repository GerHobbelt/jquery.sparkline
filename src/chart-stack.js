    /**
     * Stack charts
     */
    $.fn.sparkline.stack = stack = createClass($.fn.sparkline._base, {
        type: 'stack',

        init: function (el, values, options, width, height) {
            var total = 0, i;

            stack._super.init.call(this, el, values, options, width, height);

            this.shapes = {}; // map shape ids to value offsets
            this.valueShapes = {}; // maps value offsets to shape ids
            this.values = values = $.map(values, Number);

            if (options.get('width') === 'auto') {
                this.width = this.height;
            }

            if (values.length > 0) {
                for (i = values.length; i--;) {
                    total += values[i];
                }
            }
            this.total = total;
            this.initTarget();
            this.height = this.canvasHeight;
            this.width = this.canvasWidth;
        },

        getRegion: function (el, x, y) {
            var shapeid = this.target.getShapeAt(el, x, y);
            return (shapeid !== undefined && this.shapes[shapeid] !== undefined) ? this.shapes[shapeid] : undefined;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                percent: this.values[currentRegion] / this.total * 100,
                color: this.options.get('sliceColors')[currentRegion % this.options.get('sliceColors').length],
                offset: currentRegion
            };
        },

        changeHighlight: function (highlight) {
            var currentRegion = this.currentRegion,
                 newslice = this.renderSlice(currentRegion, highlight),
                 shapeid = this.valueShapes[currentRegion];
            delete this.shapes[shapeid];
            this.target.replaceWithShape(shapeid, newslice);
            this.valueShapes[currentRegion] = newslice.id;
            this.shapes[newslice.id] = currentRegion;
        },

        renderSlice: function (valuenum, highlight) {
            var target = this.target,
                options = this.options,
                height = this.height,
                width = this.width,
                values = this.values,
                total = this.total,
                start = 0,
                end = 0,
                i, vlen, color;

            vlen = values.length;
            for (i = 0; i < vlen; i++) {
                start = end;
                var sliceWidth = Math.round(values[i] * width / total);
                if (valuenum === i) {
                    color = options.get('sliceColors')[i % options.get('sliceColors').length];
                    if (highlight) {
                        color = this.calcHighlightColor(color, options);
                    }
                    return target.drawRect(start, 0, sliceWidth, height, undefined, color);
                }
                end += sliceWidth;
            }
        },

        render: function () {
            var target = this.target,
                values = this.values,
                options = this.options,
                borderWidth = options.get('borderWidth'),
                shape, i;

            if (!stack._super.render.call(this)) {
                return;
            }
            for (i = 0; i < values.length; i++) {
                if (values[i]) { // don't render zero values
                    shape = this.renderSlice(i).append();
                    this.valueShapes[i] = shape.id; // store just the shapeid
                    this.shapes[shape.id] = i;
                }
            }
            target.render();
        }
    });
