import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    menuItemId: number;
    price: number;
};

type OrderItemStore = {
    orders: Record<OrderContextKey, OrderItem[]>; // ✅ scoped by tenant+table
    sessions: Record<OrderContextKey, OrderSession | undefined>;
    setOrderItems: (key: OrderContextKey, orderItems: OrderItem[]) => void;
    addOrUpdateOrderItem: (key: OrderContextKey, orderItem: OrderItem) => void;
    removeOrderItem: (key: OrderContextKey, menuItemId: number, variantId: number | string) => void;
    clearOrder: (key: OrderContextKey) => void;
    getTotalAmount: (key: OrderContextKey) => number;
    setSession: (key: OrderContextKey, session: OrderSession) => void;
    clearSession: (key: OrderContextKey) => void;
};

export const useOrderItemStore = create<OrderItemStore>()(
    persist(
        (set, get) => ({
            orders: {},
            sessions: {},

            setOrderItems: (key, orderItems) =>
                set((state) => ({
                    orders: { ...state.orders, [key]: orderItems },
                })),

            addOrUpdateOrderItem: (key, orderItem) =>
                set((state) => {
                    const existing = state.orders[key] ?? [];
                    const idx = existing.findIndex((i) => i.menuItemId === orderItem.menuItemId && i.variantId === orderItem.variantId);

                    const updated = idx > -1 ? existing.map((i, index) => (index === idx ? { ...i, ...orderItem } : i)) : [...existing, orderItem];

                    return { orders: { ...state.orders, [key]: updated } };
                }),

            removeOrderItem: (key, menuItemId, variantId) =>
                set((state) => ({
                    orders: {
                        ...state.orders,
                        [key]: (state.orders[key] ?? []).filter((i) => i.menuItemId !== menuItemId || i.variantId !== variantId),
                    },
                })),

            clearOrder: (key) =>
                set((state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [key]: _, ...rest } = state.sessions;
                    return { sessions: rest };
                }),
        }),
        {
            name: 'multi-tenant-order-store',
        },
    ),
);
