import type { Linter } from 'eslint';
import { COMMON_ERROR_MESSAGES } from '../lib/constants';
import { memo } from 'react';

function formatMessage({ line, column, message }: { line?: number, column?: number, message: string }) {
  // line and column are undefined when parsing cannot occur (e.g. misconfiguration)
  if (typeof line === 'number' && typeof column === 'number') {
    return (
      <>
        <strong>[Line {line} Col {column}]</strong>
        {' '}
        {message}
      </>
    );
  }

  return message;
}

interface MessageProps {
  value: Linter.LintMessage,
  onShowError: (line?: number, column?: number) => void
}

export default memo(function Message({ value, onShowError }: MessageProps) {
  return (
    <button
      type="button"
      className="alert"
      title={value.message}
      onClick={() => onShowError?.(value.line, value.column)}
    >
      {formatMessage(value)}
      {
        value.fatal
          ? (
            <>
              <hr />
              <p>{COMMON_ERROR_MESSAGES.parsingError}</p>
            </>
          )
          : [
            ' (',
            (
              value.ruleId?.startsWith('monsterbation')
                ? value.ruleId
                : (
                  <a
                    key="ruleLink"
                    href={`https://eslint.org/docs/rules/${value.ruleId || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {value.ruleId}
                  </a>
                )
            ),
            ')'
          ]
      }
      {
        value.ruleId && COMMON_ERROR_MESSAGES[value.ruleId] && (<><hr /><p>{COMMON_ERROR_MESSAGES[value.ruleId]}</p></>)
      }
    </button>
  );
});
