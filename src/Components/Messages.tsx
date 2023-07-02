import type { Linter } from 'eslint';

import { Message } from './Message';
import { memo } from 'react';

interface MessagesProps {
  isEmpty: boolean,
  values?: Linter.LintMessage[],
  lintError?: unknown
}

const _Messages = ({
  isEmpty,
  lintError,
  values
}: MessagesProps) => {
  if (isEmpty) {
    return (
      <div id="results" className="col-xs-4">
        <div className="info"><strong>Paste your Monsterbation Keybind settings in the left. Only one keybind at a time.</strong></div>
      </div>
    );
  }

  if (lintError) {
    return (
      <div id="results" className="col-xs-4">
        <div className="warning">
          There is something wrong when trying to check your configuraion.
          <br />
          Please report it <a href="https://forums.e-hentai.org/index.php?showtopic=253425" target="_blank" rel="noreferrer noopenner">here</a> with your configuration and the error log below:
          <br />
          <pre>
            <code>
              {String(lintError)}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  if (!values || values.length === 0) {
    return (
      <div id="results" className="col-xs-4">
        <div className="success"><strong>Your configuration passes the test!</strong></div>
      </div>
    );
  }

  return (
    <div id="results" className="col-xs-4">
      <p>
        <strong className="error">Your configuration doesn&apos;t pass the test!</strong>
      </p>
      <p className="error">
        Please check the error messages below.<br />
        You can locate the cursor to the error by clicking the error message.
      </p>
      {
        values.map(message => {
          return (
            <Message
              key={`${message.line}:${message.column}:${message.ruleId || ''}`}
              value={message}
            />
          );
        })
      }
    </div>
  );
};

export const Messages = memo(_Messages);
