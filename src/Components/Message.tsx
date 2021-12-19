import type React from 'react';
import type { Linter } from 'eslint';
import events from '../lib/events';
import { COMMON_ERROR_MESSAGES, MONSTERBATION_GLOBALS_CODE_LINES } from '../lib/constants';

function formatMessage({ line, column, message }: { line?: number; column?: number; message: string }) {
  // line and column are undefined when parsing cannot occur (e.g. misconfiguration)
  if (typeof line === 'number' && typeof column === 'number') {
    return (
      <>
        <strong>[Line {line - MONSTERBATION_GLOBALS_CODE_LINES} Col {column}]</strong>{' '}{message}
      </>
    );
  }

  return (
    <>{message}</>
  );
}

interface MessageProps {
  value: Linter.LintMessage;
}

export const Message: React.FC<MessageProps> = (props) => {
  console.log(props.value);
  return (
    <button
      className="alert"
      title={props.value.message}
      onClick={
        () => events.emit('showError', props.value.line, props.value.column)
      }
    >
      {formatMessage(props.value)}
      {
        props.value.fatal
          ? (<><hr /><p>{COMMON_ERROR_MESSAGES.parsingError}</p></>)
          : [
            ' (',
            (
              props.value.ruleId?.startsWith('monsterbation')
                ? props.value.ruleId
                : (
                  <a
                    key="ruleLink"
                    href={`https://eslint.org/docs/rules/${props.value.ruleId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {props.value.ruleId}
                  </a>
                )
            ),
            ')'
          ]
      }
      {
        props.value.ruleId && COMMON_ERROR_MESSAGES[props.value.ruleId] && (<><hr /><p>{COMMON_ERROR_MESSAGES[props.value.ruleId]}</p></>)
      }
    </button>
  );
};
