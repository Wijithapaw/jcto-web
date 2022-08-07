import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { useAppSelector } from './app/hooks';
import { authUserSelector } from './app/core-slice';

function App() {
  const authenticated = !!useAppSelector(authUserSelector);

  return <MainLayout>
    {
      authenticated ? <Routes>
        <Route path="/customers" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/customer-entries" element={<PrivateRoute><div>Customers</div></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/orders" />} />
      </Routes> : null
    }
  </MainLayout>
}

export default App;
