import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authUserSelector, setAuthUser } from './app/core-slice';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { useEffect } from 'react';

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
    region: 'ap-south-1',
    userPoolId: 'ap-south-1_aup9LWNw7',
    userPoolWebClientId: '2n1qg8ll8t2u7c6oba99s4bohc',
    mandatorySignIn: true,
    oauth: {
      domain: 'devjctops.auth.ap-south-1.amazoncognito.com',
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:3000',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'code',
    },
  },
  API: {
    endpoints: [
      {
        name: "jctops",
        endpoint: "http://localhost:6000/",
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

    Auth.currentAuthenticatedUser().then(user => {
      dispatch(setAuthUser({ email: user.username, name: user.username }));
    }).catch(() => {
      dispatch(setAuthUser(undefined));
    });
  }, []);

  return <MainLayout>
    {
      authenticated ? <Routes>
        <Route path="/customers" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/customer-entries" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/" element={<Navigate to={authenticated ? "/orders" : "/"} />} />
      </Routes> : null
    }
  </MainLayout>
}

export default App;
