import { Auth } from "aws-amplify";
import { Link, useLocation } from "react-router-dom";
import { authUserSelector } from "./app/core-slice";
import { useAppSelector } from "./app/hooks";
import GlobalError from "./components/GlobalError";
import AppToast from "./components/AppToast";

const routes = [
    { path: '/customers', title: 'Customers' },
    { path: '/entries', title: 'Entries' },
    { path: '/orders', title: 'Orders' },
];

interface Props {
    children: any;
}

export default function MainLayout({ children }: Props) {
    const user = useAppSelector(authUserSelector);
    const authenticated = !!user;

    const location = useLocation();

    const isActivePath = (path: string) => {
        return location.pathname.toLowerCase().startsWith(path);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className='navbar-brand' to="/">JCT OPS</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {
                                authenticated ? <>
                                    {routes.map((path) => <li className="nav-item" key={path.path}>
                                        <Link className={`nav-link ${isActivePath(path.path) ? 'active' : ''}`} to={path.path}>{path.title}</Link>
                                    </li>)}
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle"
                                            id="navbarDropdown"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            {user.name}
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li>
                                                <a className="dropdown-item" href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        Auth.signOut();
                                                    }}>Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </> : <li className="nav-item">
                                    <a className="nav-link active" href="#" onClick={() => Auth.federatedSignIn()}>Login</a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container">
                {children}
            </div>
            <GlobalError />
            <AppToast />
        </>
    )
}