import { Link } from "react-router-dom";
import { authUserSelector } from "./app/core-slice";
import { useAppSelector } from "./app/hooks";
import GlobalError from "./components/GlobalError";
import SapToast from "./components/SapToast";

interface Props {
    children: any;
}

export default function MainLayout({ children }: Props) {
    const user = useAppSelector(authUserSelector);
    const authenticated = !!user;

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className='navbar-brand' to="/login">JCT OPS</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {
                                !authenticated ? <>
                                    <li className="nav-item"><Link className="nav-link active" to="/customers">Customers</Link></li>
                                    <li className="nav-item"><Link className="nav-link active" to="/orders">Orders</Link></li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle"
                                            id="navbarDropdown"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            JCT Manager
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="#" onClick={() => { }}>Logout</a></li>
                                        </ul>
                                    </li>
                                </> : <li className="nav-item"><Link className="nav-link active" to="/login">Login</Link></li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container">
                {children}
            </div>
            <GlobalError />
            <SapToast />
        </>
    )
}