(function () {
    'use strict';

    // Line charts taking their values from the tag
    $('.sparkline').sparkline();

    // Bar charts using inline values
    $('.sparkbar').sparkline('html', { type: 'bar' });

    // Composite line charts, the second using values supplied via javascript
    $('#compositeline').sparkline('html', { fillColor: false, changeRangeMin: 0, chartRangeMax: 10 });
    $('#compositeline').sparkline(
        [4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7],
        {
            composite: true,
            fillColor: false,
            lineColor: 'red',
            changeRangeMin: 0,
            chartRangeMax: 10
        }
    );

    // Bar + line composite charts
    $('#compositebar').sparkline('html', { type: 'bar', barColor: '#aaf' });
    $('#compositebar').sparkline(
        [4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7],
        {
            composite: true,
            fillColor: false,
            lineColor: 'red'
        }
    );

    // Line charts with normal range marker
    $('#normalline').sparkline('html', { fillColor: false, normalRangeMin: -1, normalRangeMax: 8 });
    $('#normalExample').sparkline('html', { fillColor: false, normalRangeMin: 80, normalRangeMax: 95, normalRangeColor: '#4f4' });

    // Discrete charts
    $('#discrete1').sparkline('html', { type: 'discrete', lineColor: 'blue', xwidth: 18 });
    $('#discrete2').sparkline('html', { type: 'discrete', lineColor: 'blue', thresholdColor: 'red', thresholdValue: 4 });

    // Customized line chart
    $('#linecustom1').sparkline('html',
        {
            height: '1.5em', width: '8em', lineColor: '#f00', fillColor: '#ffa',
            minSpotColor: false, maxSpotColor: false, spotColor: '#77f', spotRadius: 3
        }
    );
    $('#linecustom2').sparkline('html',
        {
            type: 'bar',
            height: '1.5em', width: '8em', lineColor: '#f00', fillColor: '#ffa',
            minSpotColor: false, maxSpotColor: false, spotColor: '#77f', spotRadius: 3
        }
    );

    // Tri-state charts using inline values
    $('.sparktristate').sparkline('html', { type: 'tristate' });
    $('.sparktristatecols').sparkline('html', { type: 'tristate', colorMap: { '-2': '#fa7', '2': '#44f' } });

    // Box plots
    $('.sparkboxplot').sparkline('html', { type: 'box' });
    $('.sparkboxplotraw').sparkline([1, 3, 5, 8, 10, 15, 18], { type: 'box', raw: true, showOutliers: true, target: 6 });

    // Pie charts
    $('.sparkpie').sparkline('html', { type: 'pie', height: '1.0em' });

    // Bullet charts
    $('.sparkbullet').sparkline('html', { type: 'bullet' });

})();

/** Draw all the example sparklines on the index page **/
function drawDocSparklines() {




    // Larger line charts for the docs
    $('.largeline').sparkline('html',
        { type: 'line', height: '2.5em', width: '4em' });



    $('.barformat').sparkline([1, 3, 5, 3, 8], {
        type: 'bar',
        tooltipFormat: '{{value:levels}} - {{value}}',
        tooltipValueLookups: {
            levels: $.range_map({ ':2': 'Low', '3:6': 'Medium', '7:': 'High' })
        }
    });







    // Box plot with specific field order
    $('.boxfieldorder').sparkline('html', {
        type: 'box',
        tooltipFormatFieldlist: ['med', 'lq', 'uq'],
        tooltipFormatFieldlistKey: 'field'
    });

    // click event demo sparkline
    $('.clickdemo').sparkline();
    $('.clickdemo').bind('sparklineClick', function (ev) {
        var sparkline = ev.sparklines[0],
            region = sparkline.getCurrentRegionFields();
        value = region.y;
        alert("Clicked on x=" + region.x + " y=" + region.y);
    });

    // mouseover event demo sparkline
    $('.mouseoverdemo').sparkline();
    $('.mouseoverdemo').bind('sparklineRegionChange', function (ev) {
        var sparkline = ev.sparklines[0],
            region = sparkline.getCurrentRegionFields();
        value = region.y;
        $('.mouseoverregion').text("x=" + region.x + " y=" + region.y);
    }).bind('mouseleave', function () {
        $('.mouseoverregion').text('');
    });;

};


// Little hack to dock an element to the top of the screen
$.fn.dock = function () {
    // wrap the element
    if (!this.length) {
        return;
    }
    var $el = $(this[0]),
        el_ypos = $el.offset().top,
        el_height = $el.height(),
        el_width = $el.width(),
        el_xpos = $el.offset().left,
        is_docked = false,
        $spacer = $('<div style="position: relative; height: ' + el_height + 'px; display: none"></div>');

    $el.after($spacer);

    $(window).scroll(function () {
        var ypos = $(document).scrollTop();
        if (is_docked && ypos < el_ypos) {
            is_docked = false;
            $el.css('position', 'relative');
            $spacer.hide();
        } else if (!is_docked && ypos > el_ypos) {
            is_docked = true;
            $el.css({ position: 'fixed', top: '0px' });
            $spacer.show();
        }
    });
}

/** Plot the stock indexes and the latest San Francisco Giants results
  * The data for this is gathered by some Python scripts I have on the server **/
function drawTitleSparklines(data) {
    $('#dow').sparkline(data.dow_volume, { height: '1.3em', type: 'bar', barSpacing: 0, barWidth: 3, barColor: '#ddd', tooltipPrefix: 'Volume: ' });
    $('#dow').sparkline(data.dow_prices, { composite: true, height: '1.3em', fillColor: false, lineColor: 'black', tooltipPrefix: 'Index: ' });
    //$('#nasdaq').sparkline(data.nasdaq_volume, {height: '1.3em', type: 'bar', barSpacing: 0, barWidth: 3, barColor: '#ddd', tooltipPrefix: 'Volume'});
    $('#nasdaq').sparkline(data.nasdaq_prices, { composite: false, height: '1.3em', fillColor: false, lineColor: 'black', tooltipPrefix: 'Index: ' });
    $('#giants').sparkline(data.giants_results, { type: 'tristate' });
};

/** Handle updating the "try it" graphs form in the examples section **/
function drawBuildYourOwnSparkline() {
    var options = {
        line: [
            // param name, display name, can_be_disabled, default value, type, docsection, desc
            ['values', 'Values', false, [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], 'list', 'common'],
            ['width', 'Width', false, 'auto', 'str', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['lineColor', 'Line Colour', false, getDefault('line', 'lineColor'), 'color', 'common'],
            ['fillColor', 'Fill Colour', true, getDefault('line', 'fillColor'), 'color', 'common'],
            ['lineWidth', 'Line Width', false, getDefault('line', 'lineWidth'), 'num', 'line'],
            ['spotColor', 'Spot Colour', true, getDefault('line', 'spotColor'), 'color', 'line'],
            ['minSpotColor', 'Min Spot Colour', true, getDefault('line', 'minSpotColor'), 'color', 'line'],
            ['maxSpotColor', 'Max Spot Colour', true, getDefault('line', 'maxSpotColor'), 'color', 'line'],
            ['highlightSpotColor', 'Hi-Spot Colour', true, getDefault('line', 'highlightSpotColor'), 'color', 'line'],
            ['highlightLineColor', 'Hi-Line Colour', true, getDefault('line', 'highlightLineColor'), 'color', 'line'],
            ['spotRadius', 'Spot Radius', false, getDefault('line', 'spotRadius'), 'num', 'line'],
            ['chartRangeMin', 'Min Y Range', false, getDefault('line', 'chartRangeMin'), 'num', 'line'],
            ['chartRangeMax', 'Max Y Range ', false, getDefault('line', 'chartRangeMax'), 'num', 'line'],
            ['chartRangeMinX', 'Min X Range', false, getDefault('line', 'chartRangeMinX'), 'num', 'line'],
            ['chartRangeMaxX', 'Max X Range', false, getDefault('line', 'chartRangeMaxX'), 'num', 'line'],
            ['normalRangeMin', 'Min Normal Value', false, getDefault('line', 'normalRangeMin'), 'num', 'line'],
            ['normalRangeMax', 'Max Normal Value', false, getDefault('line', 'normalRangeMax'), 'num', 'line'],
            ['normalRangeColor', 'Normal Colour', false, getDefault('line', 'normalRangeColor'), 'color', 'line'],
            ['drawNormalOnTop', 'Draw Normal On Top', false, getDefault('line', 'drawNormalOnTop'), 'bool', 'line']
        ],
        bar: [
            ['values', 'Values', false, [5, 6, 7, 2, 0, -4, -2, 4], 'list', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['barWidth', 'Bar Width', false, getDefault('bar', 'barWidth'), 'num', 'bar'],
            ['barSpacing', 'Bar Spacing', false, getDefault('bar', 'barSpacing'), 'num', 'bar'],
            ['zeroAxis', 'Zero Axis', false, getDefault('bar', 'zeroAxis'), 'bool', 'bar'],
            ['barColor', 'Bar Colour', false, getDefault('bar', 'barColor'), 'color', 'bar'],
            ['negBarColor', 'Negative Bar Colour', false, getDefault('bar', 'negBarColor'), 'color', 'bar'],
            ['zeroColor', 'Zero Bar Colour', false, getDefault('bar', 'zeroColor'), 'color', 'bar'],
            ['nullColor', 'Null Bar Colour', true, getDefault('bar', 'nullColor'), 'color', 'bar'],
            ['stackedBarColor', 'Stacked Bar Color', false, getDefault('bar', 'stackedBarColor'), 'list', 'bar']
        ],
        tristate: [
            ['values', 'Values', false, [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1], 'list', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['posBarColor', 'Positive Bar Colour', false, getDefault('tristate', 'posBarColor'), 'color', 'tristate'],
            ['negBarColor', 'Negative Bar Colour', false, getDefault('tristate', 'negBarColor'), 'color', 'tristate'],
            ['zeroBarColor', 'Zero Bar Colour', false, getDefault('tristate', 'zeroBarColor'), 'color', 'tristate'],
            ['barWidth', 'Bar Width', false, getDefault('tristate', 'barWidth'), 'num', 'tristate'],
            ['barSpacing', 'Bar Spacing', false, getDefault('tristate', 'barSpacing'), 'num', 'tristate'],
            ['zeroAxis', 'Zero Axis', false, getDefault('tristate', 'zeroAxis'), 'bool', 'tristate']
        ],
        discrete: [
            ['values', 'Values', false, [4, 6, 7, 7, 4, 3, 2, 1, 4, 4], 'list', 'common'],
            ['width', 'Width', false, 'auto', 'str', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['lineColor', 'Line Colour', false, getDefault('discrete', 'lineColor'), 'color', 'common'],
            ['lineHeight', 'Line Height', false, getDefault('discrete', 'lineHeight'), 'num', 'discrete'],
            ['thresholdValue', 'Threshold Value', false, getDefault('discrete', 'thresholdValue'), 'num', 'discrete'],
            ['thresholdColor', 'Threshold Color', false, getDefault('discrete', 'thresholdColor'), 'color', 'discrete']
        ],
        bullet: [
            ['values', 'Values', false, [10, 12, 12, 9, 7], 'list', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['targetWidth', 'Target Width', false, 'auto', 'num', 'bullet'],
            ['targetColor', 'Target Colour', false, getDefault('bullet', 'targetColor'), 'color', 'bullet'],
            ['performanceColor', 'Performance Colour', false, getDefault('bullet', 'performanceColor'), 'color', 'bullet'],
            ['rangeColors', 'Range Colours', false, getDefault('bullet', 'rangeColors'), 'list-str', 'bullet']
        ],
        pie: [
            ['values', 'Values', false, [1, 1, 2], 'list', 'common'],
            ['width', 'Width', false, 'auto', 'str', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['sliceColors', 'Slice Colours', false, getDefault('pie', 'sliceColors'), 'list-str', 'pie'],
            ['offset', 'Offset', false, getDefault('pie', 'offset'), 'num', 'pie'],
            ['borderWidth', 'Border Width', false, getDefault('pie', 'borderWidth'), 'num', 'pie'],
            ['borderColor', 'Border Colour', false, getDefault('pie', 'borderColor'), 'color', 'pie']
        ],
        box: [
            ['values', 'Values', false, [4, 27, 34, 52, 54, 59, 61, 68, 78, 82, 85, 87, 91, 93, 100], 'list', 'common'],
            ['width', 'Width', false, 'auto', 'str', 'common'],
            ['height', 'Height', false, 'auto', 'str', 'common'],
            ['raw', 'Raw', false, getDefault('box', 'raw'), 'bool', 'boxplot'],
            ['target', 'Target Value', false, getDefault('box', 'target'), 'num', 'boxplot'],
            ['minValue', 'Minimum Value', false, getDefault('box', 'minValue'), 'num', 'boxplot'],
            ['maxValue', 'Maximum Value', false, getDefault('box', 'maxValue'), 'num', 'boxplot'],
            ['showOutliers', 'Show Outliers', false, getDefault('box', 'showOutliers'), 'bool', 'boxplot'],
            ['outlierIQR', 'Outlier IQR', false, getDefault('box', 'outlierIQR'), 'num', 'boxplot'],
            ['spotRadius', 'Spot Marker Radius', false, getDefault('box', 'spotRadius'), 'num', 'boxplot'],
            ['boxLineColor', 'Box Line Color', false, getDefault('box', 'boxLineColor'), 'color', 'boxplot'],
            ['boxFillColor', 'Box Fill Color', false, getDefault('box', 'boxFillColor'), 'color', 'boxplot'],
            ['whiskerColor', 'Whisker Color', false, getDefault('box', 'whiskerColor'), 'color', 'boxplot'],
            ['outlierLineColor', 'Outlier Line Color', false, getDefault('box', 'outlierLineColor'), 'color', 'boxplot'],
            ['outlierFillColor', 'Outlier Fill Color', false, getDefault('box', 'outlierFillColor'), 'color', 'boxplot'],
            ['medianColor', 'Median Color', false, getDefault('box', 'medianColor'), 'color', 'boxplot'],
            ['targetColor', 'Target Color', false, getDefault('box', 'targetColor'), 'color', 'boxplot']
        ]
    };
    // native values the user has selected
    var currentValues = {};
    for (var s in options) {
        if (options.hasOwnProperty(s)) {
            currentValues[s] = {};
        }
    }

    // fetch the default value from the sparkline plugin
    function getDefault(type, setting) {
        return $.fn.sparkline.defaults[type][setting] || $.fn.sparkline.defaults['common'][setting];
    }

    function getOption(type, setting) {
        var typeoptions = options[type],
            i;
        for (i = 0; i < typeoptions.length; i++) {
            if (typeoptions[i][0] == setting) {
                return parseOption(typeoptions[i]);
            }
        }
    }

    // parse the options array into something more manageable
    function parseOption(option) {
        return {
            setting: option[0],
            name: option[1],
            can_be_disabled: option[2],
            defaultval: option[3],
            valtype: option[4],
            docsection: option[5]
        }
    }
    //
    // convert a string to a native type
    function parseOptionValue(option, value) {
        if (value == 'undefined') return undefined;
        switch (option.valtype) {
            case 'list':
            case 'list-str':
                return value.split(',');
                break;
            case 'int':
                return parseInt(value, 10);
                break;
            case 'num':
                return parseFloat(value);
                break;
            case 'bool':
                return value ? true : false;
            case 'color':
                return (value.substr(0, 1) == '#') ? value : '#' + value;
            case 'str':
            default:
                return value;
        }
    }

    // convert a native type to a string for the code example
    function formatOptionValue(option, value) {
        var vals;

        if (value === undefined || value === null) {
            return 'undefined';
        }

        switch (option.valtype) {
            case 'list':
                return '[' + value.join(',') + ']';
            case 'list-str':
                vals = $.map(value, function (val) { return "'" + val + "'"; });
                return '[' + vals.join(',') + ']';
            case 'int':
            case 'num':
                return value;
            case 'bool':
                return value ? 'true' : 'false';
            case 'str':
            case 'color':
            default:
                return "'" + value + "'";

        }
    }

    // convert a native type to somethign suited to display
    function formatForDisplay(option, value) {
        var v, i;
        switch (option.valtype) {
            case 'color':
                if (value) {
                    value = value.substr(1); // strip #
                    if (value.length == 3) {
                        v = value;
                        value = '';
                        for (i = 0; i < 3; i++) {
                            value += v.substr(i, 1) + '0';
                        }
                    }
                }
                break;
        }
        return value;
    }

    // User picked a different chart type
    function switchType() {
        var type = $('#charttype').val(),
            lihtml = [],
            disable_input = '',
            disable_checkbox = '',
            setting, name, stylename, defaultval, current, i, j, option, inputel, val, disable, cpicker_css, is_disabled;
        for (i = 0; i < options[type].length; i++) {
            option = parseOption(options[type][i]);
            current = currentValues[type][option.setting] !== undefined ? currentValues[type][option.setting] : option.defaultval;
            display_current = formatForDisplay(option, current);
            disable_input = '';
            disable_checkbox = '';

            if (option.can_be_disabled) {
                is_enabled = (current !== undefined) ? 'checked' : '';
                disable_checkbox = '<input type="checkbox" value="1" name="disable-' + option.setting + '" ' + is_enabled + '>';
                if (!is_enabled) {
                    disable_input = 'disabled';
                }
            }
            switch (option.valtype) {
                case 'bool':
                    inputel = '<input type="checkbox" value="1" name="' + option.setting + '" class="' + option.stylename + '"' + disable_input;
                    if (current) {
                        inputel += ' checked>';
                    } else {
                        inputel += '>';
                    }
                    break;
                default:
                    //cpicker_css = (option.valtype == 'color' && !is_disabled) ? 'cpicker' : '';
                    inputel = '<input type="text" name="' + option.setting + '" class="type-' + option.valtype + '" value="' + display_current + ' "' + disable_input + '>';
            }
            lihtml.push('<li><span class="tryname" setting="' + option.setting + '">' + option.name + '</span>: ' + disable_checkbox + inputel + '</li>');

        }
        $('#customsettings').html(lihtml.join('\n'));
        enablePicker($('#customsettings input:enabled.type-color'));
        renderSparkline();
    }

    // Wire up the colour picker
    function enablePicker($el) {
        $el.jPicker({
            images: { clientPath: 'contrib/jpicker-1.1.6/images/' },
            'window': {
                updateInputColor: false,
                effects: { speed: { show: 'fast' } }
            }
        }, function () { $(this).change(); });
    }

    // User changed a value for one of the inputs; update the sparkline
    // and the code example
    function updateOption(e) {
        var type = $('#charttype').val(),
            $el = $(e.target),
            setting = $el.attr('name'),
            option = getOption(type, setting),
            value = $el.attr('type') == 'checkbox' ? !!$el.attr('checked') : $el.val();
        if (setting.substr(0, 8) == 'disable-') {
            // disable checkbox
            setting = setting.substr(8);
            option = getOption(type, setting);
            $input = $('input[name="' + setting + '"]');
            if (!value) {
                // disabled, remove colour picker, disable input, set value to empty
                currentValues[type][setting] = null;
                $('input[name="' + setting + '"]').attr('disabled', 'disabled');
                if (option.valtype == 'color') {
                    $input.next().hide();
                }
            } else {
                currentValues[type][setting] = undefined;
                $('input[name="' + setting + '"]').removeAttr('disabled');
                if (option.valtype == 'color') {
                    $input.next().show();
                    //enablePicker($input);
                }
            }
        } else {
            currentValues[type][setting] = parseOptionValue(option, value);
        }
        renderSparkline();
    }

    // Moused over one of the input names; show a description
    // pulled from the actual docs
    function nameMouseenter(e) {
        var type = $('#charttype').val(),
            $el = $(e.target),
            el_top = $el.offset().top,
            el_left = $el.offset().left,
            name = $el.attr('setting'),
            name_lower = name.toLowerCase(),
            option = getOption(type, name),
            $sizer = $('#sizer'),
            tttext, desc;
        if (name_lower == 'values') {
            // special case; not really an option
            switch (type) {
                case 'line':
                    desc = 'A comma separated list of numeric values; can be decimals. '
                        + 'You can specify X values too by separated x and y with a colon '
                        + 'eg. 1:5,3:6,5:10';
                    break;
                case 'bar':
                    desc = 'A comma separated list of numeric values; can be decimals.<br>'
                        + 'This can be a stacked bar chart by listing values for each series '
                        + 'delimited by colons.  eg: 1:2,2:2,3:1';
                    break;
                case 'tristate':
                case 'discrete':
                case 'pie':
                case 'boxplot':
                    desc = 'A comma separated list of numeric values; can be decimals. ';
                    break;
                case 'bullet':
                    desc = 'values for target, performance, range, range2, range3, ...';
                    break;
                case 'box':
                    desc = 'A comma separated list of value, unless raw is selected in which '
                        + 'case a pre-computed set of values should be supplied in the order:<br> '
                        + 'low_outlier, low_whisker, q1, median, q3, high_whisker, high_outlier ';
                    break;
                default:
                    desc = 'No description';
            }
        } else {
            desc = $('.' + option.docsection + ' .doc' + name_lower).text();
        }
        $sizer.text(desc);
        $('#trytip').text(desc)
            .show()
            .offset({ left: el_left, top: el_top + 15 })
            .css({ 'width': $sizer.width(), 'height': $sizer.height() });
    }

    // Moused out the label
    function nameMouseleave() {
        $('#trytip').hide();
    }

    // Draw the example sparkline using the values teh user has supplied
    function renderSparkline() {
        var type = $('#charttype').val(),
            typeoptions = options[type],
            sparkoptions = {},
            exoptions = [],
            values, option, currentval, i;
        exoptions.push(["    type: '" + type + "'"]);
        sparkoptions.type = type;
        for (i = 0; i < typeoptions.length; i++) {
            option = parseOption(typeoptions[i]);
            currentval = currentValues[type][option.setting] !== undefined ? currentValues[type][option.setting] : option.defaultval;
            if (option.setting == 'values') {
                values = currentval;
            } else if (option.defaultval != currentval) {
                //exoptions.push([option.setting, parsedcurrentval);
                exoptions.push('    ' + option.setting + ': ' + formatOptionValue(option, currentval));
                sparkoptions[option.setting] = currentval;
            }
        }
        $('#trychart').sparkline(values, sparkoptions);

        sparktext = '$("#sparkline").sparkline(['
            + values.join(',')
            + '], {\n'
            + exoptions.join(",\n")
            + '});';
        sparkhtml = $('<span />').text(sparktext).html();
        pretty = prettyPrintOne(sparkhtml, 'js');
        $('#trycode').html(prettyPrintOne(sparkhtml, 'js'));
    }

    // User toggled between the inputs list and viewing the code example
    function changeTab(e) {
        var name = $(e.target).attr('name')
        $('#trytabs a').each(function (i, el) {
            $('#' + $(el).attr('name')).hide();
            $(el).removeClass('tryselected');
        });
        $(e.target).addClass('tryselected');
        $('#' + name).show();
        return false;
    }

    $('#charttype').change(switchType).change();
    $('#customize').on('change', 'input', updateOption);
    $('#trytabs a').click(changeTab);
    $('#customize').on('mouseenter', '.tryname', nameMouseenter);
    $('#customize').on('mouseleave', '.tryname', nameMouseleave);
    $('#showmore').click(function () {
        $('#customize').css({ 'height': '100%', 'overflow': 'visible' });
        $('#showmore').hide();
        return false;
    });
    renderSparkline();
};


/** 
** Draw the little mouse speed animated graph
** This just attaches a handler to the mousemove event to see
** (roughly) how far the mouse has moved
** and then updates the display a couple of times a second via
** setTimeout()
**/
function drawMouseSpeedDemo() {
    var mrefreshinterval = 500; // update display every 500ms
    var lastmousex = -1;
    var lastmousey = -1;
    var lastmousetime;
    var mousetravel = 0;
    var mpoints = [];
    var mpoints_max = 30;
    $('html').mousemove(function (e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
            mousetravel += Math.max(Math.abs(mousex - lastmousex), Math.abs(mousey - lastmousey));
        }
        lastmousex = mousex;
        lastmousey = mousey;
    });
    var mdraw = function () {
        var md = new Date();
        var timenow = md.getTime();
        if (lastmousetime && lastmousetime != timenow) {
            var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
            mpoints.push(pps);
            if (mpoints.length > mpoints_max)
                mpoints.splice(0, 1);
            mousetravel = 0;
            $('#mousespeed').sparkline(mpoints, { width: mpoints.length * 2, tooltipSuffix: ' pixels per second' });
        }
        lastmousetime = timenow;
        setTimeout(mdraw, mrefreshinterval);
    }
    // We could use setInterval instead, but I prefer to do it this way
    setTimeout(mdraw, mrefreshinterval);
};

// Programatically switch to a different site tab
function switchTab(tabName, aname) {
    var tabs = $('#tabs').tabs(),
        found = false;
    $(tabs).find('a').each(function (i, el) {
        var href = $(el).attr('href');
        if (href == '#' + tabName) {
            $('#tabs').tabs('select', i);
            found = true;
        }
    });
    if (found && aname) {
        document.location.hash = '#' + aname;
    }
    return found;
};


/**
 * Dynamically build the table of contents
 * from doc section headings
 */
function createTOC() {
    var toc = []
    $('.doctitle').each(function (i, el) {
        var name = $(el).attr('name'),
            title = $(el).next().text();
        toc.push('<li><a href="#' + name + '">' + title + '</a></li>');
    });
    $('.doctoc').html(toc.join('\n'));
}

/**
 * If the URL references a document heading, select
 * the docs tab and return a closure that will jump to it
 */
function selectDocHeading() {
    if (document.location.hash) {
        var hash = document.location.hash;
        if (hash.substr(0, 3) == '#s-') {
            // tab
            return function () {
                switchTab(hash.substr(3));
            }
        } else {
            var frag = document.location.hash.substr(1);
            var fragel = $('a[name="' + frag + '"]');
            var p = fragel.parent();
            if (p && p.attr('id') == 'docs') {
                return function () {
                    switchTab('docs');
                    // allow time for tab to render
                    setTimeout(function () { $(document).scrollTop(fragel.offset().top); }, 1000);
                }
            }
        }
    }
}


var docsections = [], indocs = false;

/**
 * Setup the jQuery UI tabs
 */
function renderTabs() {
    $('#tabs').bind('tabsshow', function (e, ui) {
        // Make sure that any sparklines that were hidden
        // in the unrendered tab are now drawn
        $.sparkline_display_visible();
        var section = $(ui.tab).attr('href').substr(1);

        if (section == 'docs') {
            // display the TOC sidebar
            $('#doctocbox').show();
            indocs = true;
            // Track the location of the doc sections
            // when the docs tab is first opened
            if (!docsections.length) {
                $('.doctitle').each(function (i, el) {
                    docsections.push({
                        top: $(el).next().offset().top,
                        el: $(el)
                    });
                });
            }
        } else {
            // Hide the TOC when not on the docs tab
            $('#doctocbox').hide();
            indocs = false;
        }
        document.location.hash = '#s-' + section;
    });

    window.tabs = $('#tabs').tabs();
}

/**
 * Update the selected doc section in the TOC as the user scrolls
 */
function initTOCUpdater() {
    var currentSection = null;
    $(window).scroll(function () {
        if (!indocs) return;
        var ypos = $(document).scrollTop();
        var match, dc = docsections.length;
        match = docsections[0];
        for (i = 0; i < dc; i++) {
            if (ypos < docsections[i].top - 50) break;
            match = docsections[i];
        }
        secName = match.el.attr('name');
        if (currentSection != secName) {
            if (currentSection) {
                $('.doctoc a[href="#' + currentSection + '"]').parent().removeClass('highlight');
            }
            currentSection = secName;
            $('.doctoc a[href="#' + currentSection + '"]').parent().addClass('highlight');
        }
    });
}
