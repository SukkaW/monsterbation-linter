import type { Linter } from 'eslint';

import { useRef, useEffect, useCallback } from 'react';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import events from '../lib/events';

import '../editor.css';

interface EditorProps {
  text: string,
  errors?: Linter.LintMessage[],
  onChange: ({ value }: { value: string }) => void
}

export const Editor = ({ text, errors, onChange }: EditorProps) => {
  const editorRef = useRef<CodeMirror.EditorFromTextArea | undefined>(undefined);
  const textMarkersRef = useRef<Array<CodeMirror.TextMarker | undefined>>([]);

  const clearTextMarkers = () => {
    if (textMarkersRef.current.length) {
      textMarkersRef.current.forEach(marker => {
        marker?.clear();
      });
      textMarkersRef.current = [];
    }
  };

  useEffect(() => {
    const handleShowError = (line?: number, column?: number) => {
      const cursorLoc = (typeof line === 'number' && typeof column === 'number')
        ? { line: line - 1, ch: column - 1 }
        : { line: 0, ch: 0 };

      editorRef.current?.setCursor(cursorLoc);
      editorRef.current?.focus();
    };
    events.on('showError', handleShowError);

    return () => {
      events.off('showError', handleShowError);
    };
  }, [onChange]);

  useEffect(() => {
    // This will be called when the component mounts and updates
    clearTextMarkers();

    if (errors) {
      textMarkersRef.current = errors.map(error => {
        let from = {
          line: error.line - 1,
          ch: error.column - 1
        };
        let to = {
          line: (error.endLine || error.line) - 2,
          ch: (error.endColumn || error.column) - 1
        };

        if (error.fatal) {
          // line and column are undefined when parsing cannot occur (e.g. misconfiguration)
          if (typeof error.line === 'number' && typeof error.column === 'number') {
            to = {
              line: error.line - 1,
              ch: error.column
            };
          } else {
            from = {
              line: 0,
              ch: 0
            };
            to = {
              line: 0,
              ch: 0
            };
          }
        }

        return editorRef.current?.markText(from, to, { className: 'editor-error' });
      });
    }
  });

  return (
    <div className="col-xs-8">
      <textarea
        readOnly
        autoComplete="off"
        rows={100}
        ref={useCallback((el: HTMLTextAreaElement | null) => {
          if (el) {
            const editor = CodeMirror.fromTextArea(el, {
              mode: 'javascript',
              lineNumbers: true,
              showCursorWhenSelecting: true,
              styleActiveLine: true,
              matchBrackets: true,
              theme: 'bbedit'
            });

            editor.setSize(null, 600);
            editor.on('change', () => {
              onChange({ value: editor.getValue() || '' });
            });

            editorRef.current = editor;
          } else {
            editorRef.current?.toTextArea();
          }
        }, [onChange])}
        value={text}
      />
    </div>
  );
};
