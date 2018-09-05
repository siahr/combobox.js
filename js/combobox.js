/**
 * combobox.js
 *
 * (c) 2018 Infinite Corporation
 * combobox.js may be freely distributed under the MIT license.
 *
 * @author Toshio HIRAI <toshio.hirai@gmail.com>
 */

;(function($){
    $.fn.combobox = function(options) {
        const settings = $.extend( {
            'text_option_class' : 'cmb-text',
            'text_input_callback' : null,
            'text_initial_string' : '',
            'text_placeholder' : '',
            'text_on_change' : null,
            'text_on_focus' : null,
            'text_holder' : "data-text",
            'encoder' : encodeURIComponent,
            'decoder' : decodeURIComponent,
            'encode' :false,
            'prefix' : 'cmb-'
        }, options);

        this.methods = {
        };

        const encode = function(val) {
            if (!settings['encode']) return val;
            if (!settings.encoder) return val;
            return settings.encoder(val);
        };

        const decode = function(val) {
            if (!settings['encode']) return val;
            if (!settings.decoder) return val;
            return settings.decoder(val);
        };

        const textVal = function(element) {
            if (element.attr(settings['text_holder']) === undefined) return "";
            if (element.attr(settings['text_holder']) === "" && settings['text_initial_string'])  return settings['text_initial_string'];
            return decode(element.attr(settings['text_holder']))
        };

        const textClear = function(text) {
            if (settings['text_initial_string']) {
                if (text.val() === settings['text_initial_string']) text.val("");
            }
        };

        const id = function(element) {
            if (element.attr('id') !== undefined) return settings['prefix'] + element.attr('id');
            return settings['prefix'] + element.index('select');
        };

        if (this.methods[options]) {
            return this.methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return this.each(function() {
                $(this).on('change', function(e) {
                    const cmb = $('#' + id($(this))).hide();
                    if (!$(this).find('option:selected').hasClass(settings['text_option_class'])) return;
                    cmb.show().find('input').focus();
                    e.preventDefault();
                });

                const top = $(this).position().top+1, left = $(this).position().left+1, width = $(this).innerWidth()-18, height = $(this).innerHeight();
                const cmb = $('<div id="' + id($(this)) + '"></div>').css('position', 'absolute')
                    .css('top', top).css('left', left).css('width', width).css('height', height)
                    .css('line-height', '1.15').css('-webkit-text-size-adjust', '100%').css('margin', 0).hide()
                ;
                const text = $('<input type="text" class="cmbInnerText" value="">').css('position', 'relative')
                    .css('top', window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1 ? '-2px' : '0')
                    .css('left', 0).css('width', '100%')
                    .css('height', 'calc(100% - ' + (window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1 ? '1px' : '2px') + ')')
                    .css('border', '0px none').css('outline', '0')
                    .css('-moz-box-sizing', 'border-box').css('-webkit-box-sizing', 'border-box').css('box-sizing', 'border-box')
                    .attr('placeholder', settings['text_placeholder']).val(textVal($(this)))
                    .on({"input" : function() {
                            text.parent().prevAll('select:first')
                                .attr(settings['text_holder'], encode(text.val()))
                                .find('option:selected').text(text.val() || settings['text_initial_string'])
                            ;
                            if (settings['text_input_callback']) settings['text_input_callback']();
                            textClear(text);
                        }})
                        .on('focus', function() {
                            if (settings['text_on_focus']) settings['text_on_focus']();
                        })
                        .on('change', function() {
                            textClear(text);
                            if (settings['text_on_change']) settings['text_on_change']();
                        })
                ;

                $(this).after(cmb.append(text));
                const opt = $(this).find('option:selected');
                if (opt.hasClass(settings['text_option_class'])) {
                    opt.text(textVal($(this)));
                    textClear(text);
                    cmb.show();
                }
            });
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.combobox');
        }
    };
})(jQuery);
