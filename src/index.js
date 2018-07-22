import dva from 'dva';
import { Router, Route, Switch } from 'dva/router';
import HomePage from './pages/HomePage/HomePage';

// 1. Initialize
const app = dva();

// 2. Model
// Remove the comment and define your model.
//app.model({});

// 3. Router
app.router(({ history }) =>
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={HomePage} />
    </Switch>
  </Router>
);

// 4. Start
app.start('#root');
