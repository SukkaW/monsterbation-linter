import { lazy, Suspense } from 'react';
import { Spinner } from './Spinner';

const Linter = lazy(() => import('./Linter').then(mod => ({ default: mod.Linter })));

export const App = () => {
  return (
    <>
      <main className="container" style={{
        marginTop: '1.5rem'
      }}>
        <hgroup>
          <h1>Monsterbation Configuration Linter</h1>
          <h2>
            Finally, after all these years, we now have one!
          </h2>
        </hgroup>
        <article style={{
          height: '664px'
        }}>
          <Suspense fallback={<Spinner />}>
            <Linter />
          </Suspense>
        </article>
      </main>
      <footer>
        <div className="container">
          <ul>
            <li><small><a href="https://github.com/SukkaW/monsterbation-linter/" className="contrast">Source Code @ GitHub</a></small></li>
            <li><small>Licensed under <a href="https://github.com/SukkaW/monsterbation-linter/blob/master/LICENSE" className="secondary" target="_blank">MIT</a></small></li>
          </ul>
        </div>
      </footer>
    </>
  );
};