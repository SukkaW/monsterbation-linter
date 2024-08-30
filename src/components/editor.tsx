import type { Linter } from 'eslint';

import { useRef, useEffect } from 'react';

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
  const editorElementRef = useRef<HTMLTextAreaElement>(null);
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
    editorRef.current = CodeMirror.fromTextArea(editorElementRef.current!, {
      mode: 'javascript',
      lineNumbers: true,
      showCursorWhenSelecting: true,
      styleActiveLine: true,
      matchBrackets: true,
      theme: 'bbedit'
    });

    editorRef.current.setSize(null, 600);

    editorRef.current.on('change', () => {
      onChange({ value: editorRef.current?.getValue() || '' });
    });

    events.on('showError', (line?: number, column?: number) => {
      const cursorLoc = (typeof line === 'number' && typeof column === 'number')
        ? { line: line - 1, ch: column - 1 }
        : { line: 0, ch: 0 };

      editorRef.current?.setCursor(cursorLoc);
      editorRef.current?.focus();
    });

    return () => editorRef.current?.toTextArea();
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
        ref={editorElementRef}
        value={text}
      />
    </div>
  );
};
