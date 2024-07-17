
import React, {lazy, Suspense} from 'react';
import './App.css'
import { Provider } from 'react-redux';
import { store } from './Redux/store';


const MyRouter = lazy(()=> import('./RouteComponent'))
const MovieId = lazy(()=> import('./Components/ContextApi/MovieIdContext'))


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Suspense fallback={<div>Loading...........</div>}>
        <MovieId>
          <MyRouter/>
        </MovieId>
        </Suspense>
    </div>
    </Provider>
  );
}

export default App;
