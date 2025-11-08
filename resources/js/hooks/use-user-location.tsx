import { useEffect, useState } from 'react';

export function useUserLocation() {
    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
                setLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Please allow location access to place an order.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Location information is unavailable.');
                        break;
                    case err.TIMEOUT:
                        setError('Getting location timed out.');
                        break;
                    default:
                        setError('Failed to get location.');
                }
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    }, []);

    return { lat, long, loading, error };
}
