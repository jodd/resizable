import $ from 'jquery';
import {Resizable} from '../src/resizable';

$(document).ready(() => {

    const element = document.getElementsByClassName('resizable')[0];
    const $elContent = $(element).find('span');
    const $elTitle = $(element).find('strong');
    const title = $elTitle.text();

    const resizableEl = new Resizable(element, {
        minWidth: 200,
        maxWidth: 600,
        minHeight: 300,
        maxHeight: 500,
        onResize: function() {
            $elTitle.html(`${title}<br>` + this.$el.width() + ' * ' + this.$el.height());
        }
    });

    $elTitle.html(`${title}<br>` + resizableEl.$el.width() + ' * ' + resizableEl.$el.height());

    $elContent.append(
        `<br>min-width : ${resizableEl.options.minWidth}` +
        `<br>max-width : ${resizableEl.options.maxWidth}` +
        `<br>min-height : ${resizableEl.options.minHeight}` +
        `<br>max-height : ${resizableEl.options.maxHeight}`
    );

});