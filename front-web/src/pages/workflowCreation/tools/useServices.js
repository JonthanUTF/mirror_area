import { useState, useEffect } from "react";
import { API_BASE } from "../paramsHints";

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE}/about.json`);
                const data = await res.json();
                setServices(data.server?.services || []);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return { services, loading, error, setError };
};
