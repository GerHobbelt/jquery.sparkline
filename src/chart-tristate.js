    /**
     * Tristate charts
     */
    $.fn.sparkline.tristate = tristate = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'tristate',

        init: function (el, values, options, width, height) {
            var barWidth = parseInt(options.get('barWidth'), 10),
                barSpacing = parseInt(options.get('barSpacing'), 10);
            tristate._super.init.call(this, el, values, options, width, height);

            this.initTarget();

            this.regionShapes = {};
            this.barWidth = barWidth * this.target.devicePixelRatio;
            this.barSpacing = barSpacing * this.target.devicePixelRatio;
            this.totalBarWidth = (barWidth + barSpacing) * this.target.devicePixelRatio;
            this.values = $.map(values, Number);
            var rawWidth = (values.length * barWidth * this.target.devicePixelRatio) + ((values.length - 1) * barSpacing * this.target.devicePixelRatio);
            this.xScale = Math.min(1, rawWidth ? width * this.target.devicePixelRatio / rawWidth : 1);
            this.width = rawWidth * this.xScale; 

            this.initColorMap();
        },

        getRegion: function (el, x, y) {
            x /= this.xScale;
            var result = Math.floor(x * this.target.ratio / this.totalBarWidth);
            return (result < 0 || result >= this.values.length) ? undefined : result;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                color: this.calcColor(this.values[currentRegion], currentRegion),
                offset: currentRegion
            };
        },

        calcColor: function (value, valuenum) {
            var options = this.options,
                colorMapFunction = this.colorMapFunction,
                color, newColor;

            if (colorMapFunction && (newColor = colorMapFunction(this, options, valuenum, value))) {
                color = newColor;
            } else if (value < 0) {
                color = options.get('negBarColor');
            } else if (value > 0) {
                color = options.get('posBarColor');
            } else {
                color = options.get('zeroBarColor');
            }
            return color;
        },

        renderRegion: function (valuenum, highlight) {
            var values = this.values,
                options = this.options,
                target = this.target,
                canvasHeight, height, halfHeight,
                x, y, color;

            canvasHeight = target.pixelHeight;
            halfHeight = Math.round(canvasHeight / 2);

            x = valuenum * this.totalBarWidth;
            if (values[valuenum] < 0) {
                y = halfHeight;
                height = halfHeight - 1;
            } else if (values[valuenum] > 0) {
                y = 0;
                height = halfHeight - 1;
            } else {
                y = halfHeight - 1;
                height = 2;
            }
            color = this.calcColor(values[valuenum], valuenum);
            if (color === null) {
                return;
            }
            if (highlight) {
                color = this.calcHighlightColor(color, options);
            }
            return target.drawRect(x * this.xScale, y, (this.barWidth - 1) * this.xScale, height - 1, color, color);
        }
    });

