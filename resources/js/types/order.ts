import { Branch } from './branch';
import { MenuItem, MenuItemVariant } from './menu_item';
import { Table } from './table';
import { User } from './user';

export interface Order {
    id: number;
    branchId: number;
    userId: number;
    tableId?: number | null;
    customerIp?: string | null;
    customerUserAgent?: string | null;
    customerDevice?: string | null;
    orderType: string;
    lat?: number | null;
    long?: number | null;
    status: string;
    notes?: string | null;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    quantity: number;
    vatRate: number;
    orderSource?: string | null;
    orderNumber: number;

    // Relationships
    branch?: Branch;
    user?: User; // cashier/staff
    table?: Table;
    items?: OrderItem[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface OrderItem {
    id: number;
    orderId: number;
    menuItemId: number;
    variantId?: number | null;
    quantity: number;
    price: number;
    notes?: string | null;
    status: string;
    unitPrice: number;
    totalPrice: number;

    // Relationships
    order?: Order;
    menuItem?: MenuItem;
    variant?: MenuItemVariant;
}
