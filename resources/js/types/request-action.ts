import { Branch } from './branch';
import { Table } from './table';

export type RequestAction = {
    id: number;
    name: string;
    icon: string; // storage path
    branchId: number;
    branch: Branch;
};

export interface RequestActionTableRequest {
    id: number;
    status: string;
    table: Table;
    requestAction: RequestAction;
}
