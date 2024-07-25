import React, { lazy, Suspense, useState, useEffect} from 'react';
import './App.css';
import './Wrappers/Loader.scss'
import { Provider } from 'react-redux';
import { store } from './Redux/store';

const MyRouter = lazy(() => import('./RouteComponent'));
const MovieId = lazy(() => import('./Components/ContextApi/MovieIdContext'));


function App() {
  const [loading, setLoading] = useState(true);
  const fallbackDuration = 3000; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, fallbackDuration);

    return () => clearTimeout(timer);
  }, [fallbackDuration]);

  return (
    <Provider store={store}>
      <div className="App">
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <div className="loader"></div>
            </div>
          }>
            <MovieId>
              <MyRouter />
            </MovieId>
          </Suspense>
      </div>
    </Provider>
  );
}

export default App;