import { Link } from "react-router-dom";
import styled from "styled-components";

export const navbar = () => {
    return (
        <div>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/devices">Devices</Link>
            </li>
            <li>
                <Link to="/reports">Reports</Link>
            </li>
            <li>
                <Link to="/quizzes">Quizzler</Link>
            </li>
        </div>
    )
}

export const Nav = styled.nav`
    background: #ffb3ff;
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: 1;
    z-index: 12;
`;

export const NavLink = styled(Link)`
    color: #808080;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #4d4dff;
    }
`;
