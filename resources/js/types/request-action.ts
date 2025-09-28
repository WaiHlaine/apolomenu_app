import { Branch } from './branch';

export type RequestAction = {
    id: number;
    name: string;
    icon: string; // storage path
    branchId: number;
    branch: Branch;
};
