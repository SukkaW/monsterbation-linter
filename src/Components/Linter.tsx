import { Linter as ESLinter } from 'eslint';
import { useState, useEffect, startTransition } from 'react';
import { ESLINT_OPTIONS, MONSTERBATION_GLOBALS } from '../lib/constants';
import { Editor } from './Editor';
import { Messages } from './Messages';

import '../editor.css';

const MONSTERBATION_GLOBALS_CODE = [
  '/* global ',
  ...MONSTERBATION_GLOBALS,
  ' */'
].join(' ');

const linter = new ESLinter();

export const Linter = () => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<unknown>();
  const [messages, setMessages] = useState<ESLinter.LintMessage[]>([]);
  const [fatalMessage, setFatalMessage] = useState<ESLinter.LintMessage>();

  const handleChanges = ({ value }: { value: string }) => {
    startTransition(() => {
      setText(value);
    });
  };

  useEffect(() => {
    const lint = () => {
      try {
        const code = text.split('\n').map(line => {
          if (line.endsWith('\\')) {
            return line.slice(0, -1);
          }
          return line;
        }).join('\n');
        const messages = linter.verify(`${MONSTERBATION_GLOBALS_CODE}\n${code}`, ESLINT_OPTIONS);
        let fatalMessage;

        if (messages?.length > 0 && messages[0].fatal) {
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

    const { messages, fatalMessage, error } = lint();
    setMessages(messages);
    if (fatalMessage) {
      setFatalMessage(fatalMessage);
    }
    if (error) {
      setErrors(error);
    }
  }, [text]);

  useEffect(() => {
    /* eslint-disable no-console */
    console.log('messages', messages);
    console.log('fatalMessage', fatalMessage);
    console.log('errors', errors);
    /* eslint-enable no-console */
  }, [messages, fatalMessage, errors]);

  return (
    <div className="row">
      <Editor
        text={text}
        onChange={handleChanges}
        errors={messages}
      />
      <br />
      <Messages isEmpty={text === ''} values={messages} />
    </div>
  );
};
