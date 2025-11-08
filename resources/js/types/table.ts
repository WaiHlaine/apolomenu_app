import { Branch } from './branch';

export type Table = {
    id: number;
    name: string;
    qrCode: string;
    branch?: Branch;
    publicToken?: string;
    status?: string;
    tenantId: number;
    createdAt: string;
    updatedAt: string;
};
