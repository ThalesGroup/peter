import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import '@fontsource/roboto';
import '@fontsource/roboto-mono';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import '@fontsource/roboto/100-italic.css';
import '@fontsource/roboto/300-italic.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/500-italic.css';
import '@fontsource/roboto/700-italic.css';
import '@fontsource/roboto/900-italic.css';
import { createStore } from './module/shared/core/domain/store';
import Evaluation from './pages/Evaluation';
import ErrorPage from './pages/ErrorPage';
import InMemoryEvaluationVersionProvider from './module/evaluations/core/infrastructure/InMemoryEvaluationVersionProvider';
import About from './pages/About';

const inMemoryEvaluationVersionProvider =
  new InMemoryEvaluationVersionProvider();
const loadEvaluationVersionList = () => {
  return inMemoryEvaluationVersionProvider.load();
};
const store = createStore({ loadEvaluationVersionList });

const router = createBrowserRouter([
  {
    path: '/',
    element: <About />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/evaluation',
    element: <Evaluation />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
