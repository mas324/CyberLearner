import { createContext } from "react";
import { User } from "./Types";

type AppState = {
    user: User | null;
    setUser: (newUser: User) => void;
};

const AppContext = createContext<AppState>({
    user: null,
    setUser: () => {},
});

export default AppContext;
