'use client'

import { useContext } from "react";
import UserContext from "../context/userContext";

export default function BotaoLogout() {
    const { logout } = useContext(UserContext);
    return (
        <button onClick={logout} className="btn btn-danger btn-sm">
            Sair
        </button>
    );
}
