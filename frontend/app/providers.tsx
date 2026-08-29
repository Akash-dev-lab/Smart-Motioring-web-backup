"use client";

import { Provider } from "react-redux";
// import { store } from "@/store";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return { children }
}