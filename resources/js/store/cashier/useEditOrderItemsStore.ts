/* eslint-disable @typescript-eslint/no-unused-vars */
import { MenuItem } from '@/types/menu_item';
import { create } from 'zustand';

export type OrderContextKey = string; // e.g. `${tenantId}-${tableId}`

export type OrderSession = {
    orderNumber: string;
    tenantId: number | string;
    tableId: number | string;
    status: 'pending' | 'placed' | 'completed' | 'cancelled';
};

export type OrderItem = {
    quantity: number;
    notes: string;
    variantId: number | string;
    menuItem: MenuItem;
    price: number;
    status: string;
};

type EditOrderItemsStore = {
    openMenuItemDetailModal: boolean;
    setOpenMenuItemDetailModal: (open: boolean) => void;
    menuItem: MenuItem | null;
    setMenuItem: (item: MenuItem) => void;
    orders: Record<OrderContextKey, OrderItem[]>; // ✅ scoped by tenant+table
    sessions: Record<OrderContextKey, OrderSession | undefined>;
    setOrderItems: (key: OrderContextKey, orderItems: OrderItem[]) => void;
    addOrUpdateOrderItem: (key: OrderContextKey, orderItem: OrderItem) => void;
    decreaseOrderItem: (key: OrderContextKey, orderItem: OrderItem) => void;
    removeOrderItem: (key: OrderContextKey, menuItemId: number, variantId: number | string) => void;
    clearOrder: (key: OrderContextKey) => void;
    getTotalAmount: (key: OrderContextKey) => number;
    setSession: (key: OrderContextKey, session: OrderSession) => void;
    clearSession: (key: OrderContextKey) => void;
};

export const useEditOrderItemsStore = create<EditOrderItemsStore>()((set, get) => ({
    orders: {},
    sessions: {},
    menuItem: null,
    openMenuItemDetailModal: false,

    setOpenMenuItemDetailModal: (open: boolean) => set({ openMenuItemDetailModal: open }),

    setMenuItem: (item: MenuItem) => set({ menuItem: item }),

    setOrderItems: (key, orderItems) =>
        set((state) => ({
            orders: { ...state.orders, [key]: orderItems },
        })),

    addOrUpdateOrderItem: (key, orderItem) =>
        set((state) => {
            const existing = state.orders[key] ?? [];

            const idx = existing.findIndex(
                (i) =>
                    i.menuItem?.id === orderItem.menuItem?.id && i.variantId === orderItem.variantId && i.notes?.trim() === orderItem.notes?.trim(),
            );

            const updated =
                idx > -1
                    ? existing.map((i, index) =>
                          index === idx
                              ? {
                                    ...i,
                                    quantity: i.quantity + orderItem.quantity,
                                }
                              : i,
                      )
                    : [...existing, orderItem];

            return { orders: { ...state.orders, [key]: updated } };
        }),

    decreaseOrderItem: (key, orderItem) =>
        set((state) => {
            const existing = state.orders[key] ?? [];

            const idx = existing.findIndex(
                (i) =>
                    i.menuItem?.id === orderItem.menuItem?.id && i.variantId === orderItem.variantId && i.notes?.trim() === orderItem.notes?.trim(),
            );

            if (idx === -1) return state;

            const currentItem = existing[idx];
            const newQuantity = currentItem.quantity - 1;

            const updated =
                newQuantity > 0
                    ? existing.map((i, index) => (index === idx ? { ...i, quantity: newQuantity } : i))
                    : existing.filter((_, index) => index !== idx);

            return { orders: { ...state.orders, [key]: updated } };
        }),

    removeOrderItem: (key, menuItemId, variantId) =>
        set((state) => ({
            orders: {
                ...state.orders,
                [key]: (state.orders[key] ?? []).filter((i) => i.menuItem.id !== menuItemId || i.variantId !== variantId),
            },
        })),

    clearOrder: (key) =>
        set((state) => {
            const { [key]: _, ...rest } = state.orders;
            return { orders: rest };
        }),

    getTotalAmount: (key) => (get().orders[key] ?? []).reduce((total, item) => total + item.price * item.quantity, 0),

    setSession: (key, session) =>
        set((state) => ({
            sessions: { ...state.sessions, [key]: session },
        })),

    clearSession: (key) =>
        set((state) => {
            const { [key]: _, ...rest } = state.sessions;
            return { sessions: rest };
        }),
}));
