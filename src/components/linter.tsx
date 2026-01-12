import type { Linter } from 'eslint';

import { useState, startTransition, useCallback, memo } from 'react';

import { ESLINT_OPTIONS } from '../lib/constants';

import { Editor } from './editor';
import { Messages } from './messages';

// @ts-expect-error -- css imports
import 'codemirror/lib/codemirror.css';
// @ts-expect-error -- css imports
import '../editor.css';
import { extractErrorMessage } from 'foxts/extract-error-message';

import useSWRImmutable from 'swr/immutable';

function lint(linter: Linter, text: string) {
  try {
    const code = text.split('\n').map(line => {
      if (line.endsWith('\\')) {
        return line.slice(0, -1);
      }
      return line;
    }).join('\n');
    const messages = linter.verify(code, ESLINT_OPTIONS);
    let fatalMessage;

    if (messages.length > 0 && messages[0].fatal) {
      fatalMessage = messages[0];
    }
    return {
      messages,
      fatalMessage
    };
  } catch (error) {
    return {
      messages: [],
      error: extractErrorMessage(error)
    };
  }
}

declare global {
  interface Window {
    eslint?: {
      Linter: typeof Linter
    }
  }
}

function useBrowserifyLinter() {
  return useSWRImmutable('sukka://eslint-linter-browserify', async () => {
    if (!window.eslint) {
      await new Promise<void>((resolve, reject) => {
        const scriptEl = document.createElement('script');
        scriptEl.src = 'https://cdn.jsdelivr.net/npm/eslint-linter-browserify@9.39.2/linter.min.js';
        scriptEl.addEventListener('load', () => {
          resolve();
        }, { once: true });
        scriptEl.addEventListener('error', () => {
          reject(new Error('Failed to load eslint-linter-browserify script'));
        }, { once: true });
        document.body.appendChild(scriptEl);
      });
    }
    if (!window.eslint) {
      throw new Error('eslint-linter-browserify failed to load correctly');
    }
    const { Linter: BrowserifyLinter } = window.eslint;
    return new BrowserifyLinter();
  }, { suspense: true });
}

export default memo(function LinterComponent() {
  const linter = useBrowserifyLinter().data;

  const [text, setText] = useState('');
  const [error, setError] = useState<string>();
  const [messages, setMessages] = useState<Linter.LintMessage[]>([]);
  // const [, setFatalMessage] = useState<Linter.LintMessage>();

  const handleChanges = useCallback(({ value }: { value: string }) => {
    setText(value);

    const { messages, error } = lint(linter, value);
    setMessages(messages);

    // Use React 18 startTransition for better responsiveness
    startTransition(() => {
      setMessages(messages);
      // if (fatalMessage) {
      //   setFatalMessage(fatalMessage);
      // }
      if (error) {
        setError(error);
      }
    });
  }, [linter]);

  return (
    <div className="row">
      <Editor
        text={text}
        onChange={handleChanges}
        errors={messages}
      />
      <br />
      <Messages isEmpty={text === ''} values={messages} lintError={error} />
    </div>
  );
});
