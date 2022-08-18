import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authUserSelector, setAuthUser, setGlobalError } from './app/core-slice';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { useEffect } from 'react';
import CustomersPage from './features/customer/components/CustomersPage';
import { NotificationType, showNotification } from './app/notification-service';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import OrdersPage from './features/order/components/OrdersPage';
import EntryListPage from './features/entry/components/EntryListPage';
import { getCustomerListItemsAsync } from './features/customer/customer-slice';

library.add(fas);

const getAuthToken = async () => {
  try {
    const currentSession = await Auth.currentSession();
    return `Bearer ${currentSession.getAccessToken().getJwtToken()}`;
  } catch {
    return '';
  }
}

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENTID,
    mandatorySignIn: true,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_OAUTH_DOMAIN,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: window.location.origin,
      redirectSignOut: window.location.origin,
      responseType: 'code',
    },
  },
  API: {
    endpoints: [
      {
        name: "jcto",
        endpoint: process.env.REACT_APP_API_URL,
        custom_header: async () => {
          return { Authorization: `${await getAuthToken()}` }
        }
      }
    ]
  }
});

function App() {
  const dispatch = useAppDispatch();

  const authenticated = !!useAppSelector(authUserSelector);

  useEffect(() => {
    //Listen for auth events
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          dispatch(setAuthUser({ email: data.username, name: data.username }));
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          break;
        case 'oAuthSignOut':
          dispatch(setAuthUser(undefined));
          break;
      }
    });

    //Check user's authenticity
    Auth.currentAuthenticatedUser().then(user => {
      dispatch(setAuthUser({ email: user.username, name: user.username }));
    }).catch(() => {
      dispatch(setAuthUser(undefined));
    });

    //Handle unhandled errors globally
    window.onunhandledrejection = (err) => {
      const { status, errorMessage } = err.reason;
      switch (status) {
        case 400: showNotification(NotificationType.warning, errorMessage); break;
        case 409: dispatch(setGlobalError(errorMessage)); break;
        case 500: showNotification(NotificationType.error, errorMessage); break;
        default:
          console.log(err.reason);
          showNotification(NotificationType.error, errorMessage || 'Unknown error!');
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      //Load global data
      dispatch(getCustomerListItemsAsync());
    }

  }, [authenticated])

  return <MainLayout>
    {
      authenticated ? <Routes>
        <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/entries" element={<PrivateRoute><EntryListPage /></PrivateRoute>} />
        <Route path="/" element={<Navigate to={authenticated ? "/orders" : "/"} />} />
      </Routes> : null
    }
  </MainLayout>
}

export default App;
