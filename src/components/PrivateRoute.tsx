import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { authUserSelector } from '../app/core-slice';

interface Props {
  children?: any;
  permission?: string;
}

export default function PrivateRoute({ children, permission }: Props) {  
  const user = useAppSelector(authUserSelector);

  const authenticated = !!user;

  return authenticated ? children : <Navigate to="/" />;
}
