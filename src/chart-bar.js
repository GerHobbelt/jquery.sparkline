    /**
     * Bar charts
     */
    $.fn.sparkline.bar = bar = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'bar',

        init: function (el, values, options, width, height) {
            var barWidth = parseInt(options.get('barWidth'), 10),
                barSpacing = parseInt(options.get('barSpacing'), 10),
                chartRangeMin = options.get('chartRangeMin'),
                chartRangeMax = options.get('chartRangeMax'),
                chartRangeClip = options.get('chartRangeClip'),
                stackMin = Infinity,
                stackMax = -Infinity,
                isStackString, groupMin, groupMax, stackRanges, stackRangesNeg, stackTotals, actualMin, actualMax,
                numValues, i, vlen, range, zeroAxis, xaxisOffset, min, max, clipMin, clipMax,
                stacked, vlist, j, slen, svals, val, yoffset, yMaxCalc, canvasHeightEf;

            bar._super.init.call(this, el, values, options, width, height);

            // scan values to determine whether to stack bars
            for (i = 0, vlen = values.length; i < vlen; i++) {
                val = values[i];
                isStackString = typeof(val) === 'string' && val.indexOf(':') > -1;
                if (isStackString || $.isArray(val)) {
                    stacked = true;
                    if (isStackString) {
                        val = values[i] = normalizeValues(val.split(':'));
                    }
                    val = remove(val, null); // min/max will treat null as zero
                    groupMin = Math.min.apply(Math, val);
                    groupMax = Math.max.apply(Math, val);
                    if (groupMin < stackMin) {
                        stackMin = groupMin;
                    }
                    if (groupMax > stackMax) {
                        stackMax = groupMax;
                    }
                }
            }

            this.stacked = stacked;
            this.regionShapes = {};
            this.barWidth = barWidth;
            this.barSpacing = barSpacing;
            this.totalBarWidth = barWidth + barSpacing;
            var rawWidth = values.length * barWidth + (values.length - 1) * barSpacing;
            this.xScale = Math.min(1, rawWidth ? width / rawWidth : 1);
            this.width = rawWidth * this.xScale; 

            this.initTarget();

            if (chartRangeClip) {
                clipMin = chartRangeMin == null ? -Infinity : chartRangeMin;
                clipMax = chartRangeMax == null ? Infinity : chartRangeMax;
            }
            if (stacked) {
                actualMin = chartRangeMin == null ? stackMin : Math.min(stackMin, chartRangeMin);
                actualMax = chartRangeMax == null ? stackMax : Math.max(stackMax, chartRangeMax);
            }

            numValues = [];
            stackRanges = stacked ? [] : numValues;
            stackTotals = [];
            stackRangesNeg = [];
            for (i = 0, vlen = values.length; i < vlen; i++) {
                if (stacked) {
                    vlist = values[i];
                    values[i] = svals = [];
                    stackTotals[i] = 0;
                    stackRanges[i] = stackRangesNeg[i] = 0;
                    for (j = 0, slen = vlist.length; j < slen; j++) {
                        val = svals[j] = chartRangeClip ? clipval(vlist[j], clipMin, clipMax) : vlist[j];
                        if (val != null) {
                            if (val > 0) {
                                stackTotals[i] += val;
                            }
                            if (stackMin < 0 && stackMax > 0) {
                                if (val < 0) {
                                    stackRangesNeg[i] += Math.abs(val);
                                } else {
                                    stackRanges[i] += val;
                                }
                            } else {
                                stackRanges[i] += Math.abs(val - (val < 0 ? actualMax : actualMin));
                            }
                            numValues.push(val);
                        }
                    }
                } else {
                    val = chartRangeClip ? clipval(values[i], clipMin, clipMax) : values[i];
                    val = values[i] = normalizeValue(val);
                    if (val != null) {
                        numValues.push(val);
                    }
                }
            }

            this.max = max = Math.max.apply(Math, numValues);
            this.min = min = Math.min.apply(Math, numValues);
            this.stackMax = stackMax = stacked ? Math.max.apply(Math, stackTotals) : max;
            this.stackMin = stackMin = stacked ? Math.min.apply(Math, numValues) : min;
            this.stackRanges = stackRanges;
            this.stackTotals = stackTotals;

            if (chartRangeMin != null && (chartRangeClip || chartRangeMin < min)) {
                min = chartRangeMin;
            }
            if (chartRangeMax != null && (chartRangeClip || chartRangeMax > max)) {
                max = chartRangeMax;
            }

            this.zeroAxis = zeroAxis = !!options.get('zeroAxis', true);
            if (min >= 0 && max >= 0 && zeroAxis) {
                xaxisOffset = 0;
            } else if (zeroAxis === false) {
                xaxisOffset = min;
            } else if (min > 0) {
                xaxisOffset = min;
            } else {
                xaxisOffset = max;
            }
            this.xaxisOffset = xaxisOffset;

            if (zeroAxis) {
                range = stacked ? stackMax : max;
            } else {
                range = stacked ? Math.max.apply(Math, stackRanges) + Math.max.apply(Math, stackRangesNeg) : max - min;
            }
            // as we plot zero/min values as a single pixel line, we add a pixel to all other
            // values - Reduce the effective canvas size to suit
            this.canvasHeightEf = (zeroAxis && min < 0) ? this.canvasHeight - 2 : this.canvasHeight - 1;

            if (min < xaxisOffset) {
                yMaxCalc = (stacked && max >= 0) ? stackMax : max;
                yoffset = (yMaxCalc - xaxisOffset) / range * this.canvasHeight;
                if (yoffset !== Math.ceil(yoffset)) {
                    this.canvasHeightEf -= 2;
                    yoffset = Math.ceil(yoffset);
                }
            } else {
                yoffset = this.canvasHeight;
            }
            this.yoffset = yoffset;

            this.initColorMap();
            this.range = range;
        },

        getRegion: function (el, x, y) {
            x /= this.xScale; 
            var result = Math.floor(x / this.totalBarWidth);
            return (result < 0 || result >= this.values.length) ? undefined : result;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion,
                values = ensureArray(this.values[currentRegion]),
                result = [],
                value, i;
            for (i = values.length; i--;) {
                value = values[i];
                result.push({
                    isNull: value === null,
                    value: value,
                    color: this.calcColor(i, value, currentRegion),
                    offset: currentRegion
                });
            }
            return result;
        },

        calcColor: function (stacknum, value, valuenum) {
            var colorMapFunction = this.colorMapFunction,
                options = this.options,
                color, newColor;

            if (colorMapFunction && (newColor = colorMapFunction(this, options, valuenum, value))) {
                color = newColor;
            }
            else {
                if (this.stacked) {
                    color = options.get('stackedBarColor');
                } else {
                    color = (value < 0) ? options.get('negBarColor') : options.get('barColor');
                }
                if (value === 0 && options.get('zeroColor') !== undefined) {
                    color = options.get('zeroColor');
                }
            }
            return $.isArray(color) ? color[stacknum % color.length] : color;
        },

        /**
         * Render bar(s) for a region
         */
        renderRegion: function (valuenum, highlight) {
            var vals = this.values[valuenum],
                options = this.options,
                xaxisOffset = this.xaxisOffset,
                result = [],
                range = this.range,
                stacked = this.stacked,
                target = this.target,
                x = valuenum * this.totalBarWidth,
                canvasHeightEf = this.canvasHeightEf,
                yoffset = this.yoffset,
                stackTotals = this.stackTotals,
                stackRanges = this.stackRanges,
                y, height, color, isNull, yoffsetNeg, i, valcount, val, minPlotted, allMin, reserve;

            vals = $.isArray(vals) ? vals : [vals];
            valcount = vals.length;
            val = vals[0];
            isNull = all(null, vals);
            allMin = all(xaxisOffset, vals, true);

            if (isNull) {
                if (options.get('nullColor')) {
                    color = highlight ? options.get('nullColor') : this.calcHighlightColor(options.get('nullColor'), options);
                    y = (yoffset > 0) ? yoffset - 1 : yoffset;
                    return target.drawRect(x, y, this.barWidth - 1, 0, color, color);
                } else {
                    return undefined;
                }
            }
            yoffsetNeg = yoffset;
            console.log('bar: ', {
                yoffsetNeg: yoffsetNeg, 
                vals: vals, 
                range: range, 
                allMin: allMin, 
                minPlotted: minPlotted, 
                stackMin: this.stackMin, 
                stacked: stacked, 
                stackTotals: stackTotals, 
                reserve: reserve, 
                xaxisOffset: xaxisOffset
            });
            for (i = 0; i < valcount; i++) {
                val = vals[i];

                if (val < this.stackMin && range > 1) { 
                    continue; 
                }           

                if (allMin && minPlotted) {
                    continue;
                }

                if (stacked && val === stackTotals[valuenum]) {
                    minPlotted = true;
                }

                height = 0;
                reserve = 0;
                // New approach.
                if (range > 0) {
                    if (range - reserve === 1) {
                        height = canvasHeightEf * Math.abs(val / stackTotals[valuenum]) + 1;
                    } else {
                        height = (canvasHeightEf / (range - reserve)) * (val - xaxisOffset);
                    }
                } else {
                    // range is 0 - all values are the same.
                    height = Math.ceil(canvasHeightEf / (valcount || 1));
                }

                if (val < xaxisOffset || (val === xaxisOffset && yoffset === 0)) {
                    y = yoffsetNeg;
                    yoffsetNeg += height;
                } else {
                    y = yoffset - height;
                    yoffset -= height;
                }

                color = this.calcColor(i, val, valuenum);
                if (highlight) {
                    color = this.calcHighlightColor(color, options);
                }
                console.log('one bar: ', {
                  i: i, 
                  val: val, 
                  valuenum: valuenum, 
                  xaxisOffset: xaxisOffset, 
                  yoffset: yoffset, 
                  y: y, 
                  yoffsetNeg: yoffsetNeg, 
                  height: height, 
                  x: x, 
                  color: color
                });
                result.push(target.drawRect(x * this.xScale, y, (this.barWidth - 1) * this.xScale, Math.abs(height), color, color));
            }
            if (result.length === 1) {
                return result[0];
            }
            return result;
        }
    });

