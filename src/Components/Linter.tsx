import { Linter as ESLinter } from 'eslint';
import { useState, useEffect, startTransition } from 'react';

import { ESLINT_OPTIONS, MONSTERBATION_GLOBALS_CODE } from '../lib/constants';
import { MonsterbationESLintRules } from '../lib/eslint-monsterbation';

import { Editor } from './Editor';
import { Messages } from './Messages';

import '../editor.css';

const linter = new ESLinter();
linter.defineRules(MonsterbationESLintRules);

export const Linter = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState<unknown>();
  const [messages, setMessages] = useState<ESLinter.LintMessage[]>([]);
  const [, setFatalMessage] = useState<ESLinter.LintMessage>();

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
      setError(error);
    }
  }, [text]);

  const handleChanges = ({ value }: { value: string }) => {
    // Use React 18 startTransition for better responsiveness
    startTransition(() => {
      setText(value);
    });
  };

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
