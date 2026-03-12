// src/shared/hooks/useStatus.ts

import { useState, useEffect } from 'react';
import type { StatusResponse } from './useFeed';

export function useStatus() {

    const [status, setStatus] = useState<StatusResponse | null>(null);

    useEffect(() => {
        fetch('/api/status')
        .then(r => r.json())
        .then(setStatus)
        .catch(() => null)
    }, []);

    return status;
}