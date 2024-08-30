import type { Linter } from 'eslint';

import * as eslint from 'eslint-linter-browserify';

import { useState, startTransition, useCallback, memo } from 'react';

import { ESLINT_OPTIONS } from '../lib/constants';

import { Editor } from './editor';
import { Messages } from './messages';

import '../editor.css';

const linter = new eslint.Linter();

const lint = (text: string) => {
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
      error
    };
  }
};

const LinterComponent = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState<unknown>();
  const [messages, setMessages] = useState<Linter.LintMessage[]>([]);
  // const [, setFatalMessage] = useState<Linter.LintMessage>();

  const handleChanges = useCallback(({ value }: { value: string }) => {
    setText(value);

    const { messages, error } = lint(value);
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
  }, []);

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
};

export default memo(LinterComponent);
