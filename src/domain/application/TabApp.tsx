import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
// import { ApolloProvider } from 'react-apollo';
// import { gQLClient } from '../../graphQLClient';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';

import TabPage from './TabPage';
import "../../css/tabs.css";
import "../../css/light.css";
// import CollegeInfo from './CollegeSettings/college/AddCollegePage/CollegeInfo';


// export default function init() {
//   setTimeout(function () {
//     ReactDOM.render(
//       <BrowserRouter>
//         <Switch>
//           <Route
//             path="/plugins/ems-preference/page/home"
//             component={TabPage}
//           />
//         </Switch>
//       </BrowserRouter>,
//       document.getElementById('preferenceContainer')
//     );
//   }, 100);
// }

export default function init() {
  setTimeout(function () {
    ReactDOM.render(
      // <ApolloProvider client={gQLClient}>
        <TabPage/>,
      // </ApolloProvider>,
      document.getElementById('preferenceContainer')
    );
  }, 100);
}