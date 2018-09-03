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
        const self = this;

        this.settings = $.extend( {
            'text-option-class' : 'text',
            'input-callback' : null,
            'encoder' : encodeURIComponent,
            'decoder' : decodeURIComponent,
            'encode-value' :true,
            'placeholder' : '',
            'initial-text' : ''
        }, options);

        this.methods = {
            val : function() {
                if (self.val() !== "") return self.val();
                const text = self.attr("data-text");
                if (!text) return '';
                return self.decode(text);
            }
        };

        this.create = function(element, focus) {
            const top = element.position().top+1,  left = element.position().left+1, width = element.innerWidth()-18, height = element.innerHeight();
            const parent = $('<div id="' + self.id(element) + '"></div>').css('position', 'absolute')
                .css('top', top).css('left', left).css('width', width).css('height', height)
                .css('line-height', '1.15').css('-webkit-text-size-adjust', '100%').css('margin', 0);
            const textBox = $('<input type="text" class="cmbInnerText" value="">').css('position', 'relative')
                .css('top', window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1 ? '-2px' : '0')
                .css('left', 0).css('width', '100%').css('height', 'calc(100% - 2px)').css('border', '0px none').css('outline', '0')
                .css('-moz-box-sizing', 'border-box').css('-webkit-box-sizing', 'border-box').css('box-sizing', 'border-box')
                .attr('placeholder', this.settings['placeholder']);
            this.inputHandler(textBox);
            element.after(parent.append(textBox));
            if (focus) textBox.focus();
            return textBox;
        };

        this.encode = function(val) {
            if (!this.settings['encode-value']) return val;
            if (!this.settings.encoder) return val;
            return this.settings.encoder(val);
        };

        this.decode = function(val) {
            if (!this.settings['encode-value']) return val;
            if (!this.settings.decoder) return val;
            return this.settings.decoder(val);
        };

        this.inputHandler = function(input) {
            const element = input;
            element.on(
                {"input" : function() {
                    const select = element.parent().prevAll('select:first');
                    const opt = select.children(':selected');
                    select.attr('data-text', self.encode(element.val()));
                    opt.text(element.val() || self.settings['initial-text']);
                    if (self.settings['input-callback']) self.settings['input-callback']();
                }})
                .on('focus', function(){
                    //this.select();
                })
                .on('change', function(){
                })
            ;
        };

        this.textVal = function(element) {
            if (element.attr('data-text') === undefined) return "";
            return this.decode(element.attr('data-text'))
        };

        this.id = function(element) {
            return 'cmb-' + element.attr('id');
        };

        this.on('change', function() {
            const opt = $(this).children(':selected');
            const cmbId = self.id($(this)), combo = $('#' + cmbId);
            if (combo.length) combo.hide();
            if (!opt.hasClass(self.settings['text-option-class'])) return;
            combo.show();
            // opt.text(self.textVal($(this)) );
            // const textBox = self.create($(this), true);
            // textBox.val(self.textVal($(this)));
        });

        this.init = function(element) {
            const text = self.create(element).val(self.textVal(element));
            text.closest('div').hide();
            element.find('input').each(function(){
                self.inputHandler($(this))
            });
            const opt = element.children(':selected');
            if (opt.hasClass(this.settings['text-option-class'])) {
                element.children(':selected').text(self.textVal(element));
                text.closest('div').show();
            }
        };

        if (this.methods[options]) {
            return this.methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            return this.each(function() {
                self.init($(this));
            });
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.combobox');
        }
    };
})(jQuery)
