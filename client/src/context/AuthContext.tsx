import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

type IAuthContextProps = {
    children?: ReactNode;
}

type IAuthContext = {
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void
}

const initialValue = {
    authenticated: false,
    setAuthenticated: () => { }
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: IAuthContextProps) => {
    //Initializing an auth state with flase value (unauthenticated)
    const [authenticated, setAuthenticated] = useState(initialValue.authenticated)

    const navigate = useNavigate()

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>{children}</AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }