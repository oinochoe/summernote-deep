$(function() {
    'use strict';

    const EDITOR = 'adminEditor';
    const SUMMER = 'summer';
    const _$editorSelector = '.editor_selector li';

    // which editor selector active state
    if (localStorage.getItem(EDITOR) === SUMMER) {
        $(_$editorSelector)
            .eq(0)
            .addClass('active');
    } else {
        $(_$editorSelector).removeClass('active');
    }

    // editor selector
    $(document).on('click', _$editorSelector, function() {
        if ($(this).data('editor') === SUMMER) {
            localStorage.setItem(EDITOR, SUMMER);
        }
        $(_$editorSelector).removeClass('active');
        $(this).addClass('active');
    });

    initSummernote('editor');
});

// summernote init
function initSummernote(id, attachFilePath) {
    $('div#' + id).summernote(
        {
            toolbar: [
                ['view', ['fullscreen', 'codeview', 'help']],
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear', 'italic', 'strikethrough']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']], // ??? ?? ??
                ['insert', ['link', 'picture', 'youtube']],
                ['table', ['table']],
                // ['misc', ['print']],
            ],

            // youtube container
            buttons: {
                youtube: function(context) {
                    var ui = $.summernote.ui;
                    var button = ui.button({
                        contents: '<i class="note-icon-video"/>',
                        tooltip: 'video',
                        click: function() {
                            var div = document.createElement('div');
                            var iframe = document.createElement('iframe');
                            var question = prompt('Enter video url : ');
                            div.classList.add('youtubeContainer');
                            div.setAttribute('contenteditable', false);
                            iframe.setAttribute('width', '100%');
                            iframe.setAttribute('allowfullscreen', true); // frameborder ?? ?? => deprecated
                            iframe.setAttribute('allow', 'autoplay; encrypted-media');

                            if (!question.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
                                alert('Invalid youtube url');
                                return;
                            } else {
                                var arr = question.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                                question = arr[2] !== undefined ? arr[2].split(/[^0-9a-z_\-]/i)[0] : arr[0];
                                question =
                                    'https://www.youtube.com/embed/' +
                                    question +
                                    '?enablejsapi=1&autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1&widgetid=1';
                                iframe.src = question;
                                div.appendChild(iframe);
                                context.invoke('editor.insertNode', div);
                            }
                        },
                    });
                    return button.render();
                },
            },
            styleTags: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            tabsize: 4,
            height: 600,
            followingToolbar: true,
            prettifyHtml: true,
            codeviewFilter: true,
            codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi,
            codemirror: {
                theme: 'monokai',
                htmlMode: true,
                lineNumbers: true,
                mode: 'text/html',
                lineWrapping: true,
            },
            callbacks: {
                // onImageUpload: function(files) {
                //     sendFile(files[0], this);
                // },
            },
            lang: 'ko-KR',
        },
        { focus: true },
    );

    // upload Image
    /* function sendFile(file, el) {
        var formData = new FormData();
        formData.append('upload', file);
        $.ajax({
            data: formData,
            type: 'POST',
            url: '/upload/FileUpload?subpath=' + attachFilePath + '&responseType=json',
            cache: false,
            contentType: false,
            processData: false,
        })
        .done(function (data) {
            if (data._resultCode == 0) {
                $(el).summernote('insertImage', data._value)
            }
            else {
                alert(data._resultMessage);
            }
        });
    } */
}

// summernote destory
function destroySummernote(id) {
    $('div#' + id).summernote('destroy');
}
