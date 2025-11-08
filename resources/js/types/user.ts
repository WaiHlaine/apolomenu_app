export type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
    emailVerifiedAt: string | null;
    roles: Role[];
    createdAt: string;
    updatedAt: string;
};

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: Pivot;
}

export interface Pivot {
    model_type: string;
    model_id: number;
    role_id: number;
}
