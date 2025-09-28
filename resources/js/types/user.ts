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

export type Role = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
};
