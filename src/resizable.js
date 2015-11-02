/* ==========================================================================
   Resizable class definition
   ========================================================================== */
import $ from 'jquery';

/* Private
   ========================================================================== */
const defaults = {
    horizontal: true, // allow horizontal resize
    vertical: true, // allow vertical resize
    text: 'Redimensionner',
    minWidth: 0, // default min/max values
    maxWidth: Infinity,
    minHeight: 0,
    maxHeight: Infinity,
    onResize: () => {} // empty callback
};

const namespace = 'resizable';
const $W = $(window);
const $D = $(document);

// Alter the .on() jquery function to namespace events automatically.
// TODO : Not sure if it's clean and/or safe, didnt find any resource about this technique. Need to dig into this.
const jqueryOn = $.fn.on;
$.fn.on = function(events, ...args) {
    return jqueryOn.apply(this, [events.split(' ').join('.' + namespace + ' ') + '.' + namespace].concat(args));
};

/* Public
   ========================================================================== */
export class Resizable {

/* constructor -------------------------------------------------------------- */
constructor(element, options) {

    // Overwrite defaults with options.
    const opt = this.options = $.extend(true, {}, defaults, options);

    this.el = element;
    this.$el = $(this.el);

    // Create the element to use as the handle.
    this.$handle = $('<button>', { 'class': 'resizable-handle' }).css('cursor', 'nwse-resize')
        .append($('<span>', { 'class': 'resizable-text' }).text(opt.text))
        .appendTo(this.el);

    // Adjust CSS cursor property according to the options.
    !opt.horizontal && this.$handle.css('cursor', 'ns-resize');
    !opt.vertical && this.$handle.css('cursor', 'ew-resize');

    // Update min/max width and height values merging options and CSS properties.
    // (options overwrite CSS)
    this.options.minWidth = options.minWidth || parseInt(this.$el.css('min-width')) || opt.minWidth;
    this.options.maxWidth = options.maxWidth || parseInt(this.$el.css('max-width')) || opt.maxWidth;
    this.options.minHeight = options.minHeight || parseInt(this.$el.css('min-height')) || opt.minHeight;
    this.options.maxHeight = options.maxHeight || parseInt(this.$el.css('max-height')) || opt.maxHeight;

    this.init();
}

/* init --------------------------------------------------------------------- */
init() {

    // Make sure the handle is positioned relatively to the resizable element.
    (this.$el.css('position') === 'static') && this.$el.css('position', 'relative');

    this.$handle.on('mousedown', e => {
        this.updatePositions(e);
        $W.on('mousemove', this.onMousemove.bind(this));
    });

    $W.on('mouseup', e => $W.off('mousemove.' + namespace));
}

/* updatePositions ---------------------------------------------------------- */
// Update mouse and handle positions.
updatePositions(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.handleX = this.$handle.offset().left + this.$handle.outerWidth() / 2;
    this.handleY = this.$handle.offset().top + this.$handle.outerHeight() / 2;
}

/* onMousemove -------------------------------------------------------------- */
onMousemove(e) {

    const opt = this.options;

    let moveX = e.clientX - this.mouseX;
    let moveY = e.clientY - this.mouseY;

    // Perform resize if option enabled and mouse position is correct compared to the handle position.
    if (opt.horizontal &&
        ((moveX > 0 && this.mouseX >= this.handleX) ||
        (moveX < 0 && this.mouseX <= this.handleX))) {

        this.$el.width(Math.min(Math.max(this.$el.width() + moveX, opt.minWidth), opt.maxWidth));
    }

    if (opt.vertical &&
        ((moveY > 0 && this.mouseY >= this.handleY) ||
        (moveY < 0 && this.mouseY <= this.handleY))) {

        this.$el.height(Math.min(Math.max(this.$el.height() + moveY, opt.minHeight), opt.maxHeight));
    }

    this.updatePositions(e);

    // TODO : could be nice to call callback only if element has actually been resized.
    // (i.e. check size before / after and compare)
    opt.onResize.call(this);

}

}
