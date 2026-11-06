import { useEffect, useRef } from 'react';

function loadScript() {
  return new Promise(function (resolve, reject) {
    if (window.ClassicEditor) {
      resolve(window.ClassicEditor);
      return;
    }
    const existing = document.getElementById('ckeditor-classic');
    if (existing) {
      existing.addEventListener('load', function () {
        resolve(window.ClassicEditor);
      });
      return;
    }
    const script = document.createElement('script');
    script.id = 'ckeditor-classic';
    script.src = 'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js';
    script.onload = function () {
      resolve(window.ClassicEditor);
    };
    script.onerror = function () {
      reject(new Error('Could not load CKEditor'));
    };
    document.body.appendChild(script);
  });
}

function Editor({ value, onChange }) {
  const holderRef = useRef(null);
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  useEffect(function () {
    let cancelled = false;

    loadScript().then(function (ClassicEditor) {
      if (cancelled || !holderRef.current || editorRef.current) return;
      return ClassicEditor.create(holderRef.current, {
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', '|',
          'bulletedList', 'numberedList', 'blockQuote', '|',
          'undo', 'redo'
        ]
      }).then(function (editor) {
        if (cancelled) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
        if (value) editor.setData(value);
        editor.model.document.on('change:data', function () {
          onChangeRef.current(editor.getData());
        });
      });
    }).catch(function (err) {
      console.error(err);
    });

    return function () {
      cancelled = true;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(function () {
    const editor = editorRef.current;
    if (!editor) return;
    if ((value || '') === editor.getData()) return;
    if (editor.editing.view.document.isFocused) return;
    editor.setData(value || '');
  }, [value]);

  return (
    <div className="editor">
      <div ref={holderRef}></div>
    </div>
  );
}

export default Editor;
