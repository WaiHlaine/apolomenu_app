import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, LayoutGrid, MapPin, QrCodeIcon, Settings, Users2, UtensilsCrossed } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users List',
        href: route('users.index'),
        icon: Users2,
    },
    {
        title: 'Hot Action',
        href: route('request-actions.index'),
        icon: BookOpen,
    },
    {
        title: 'Tables & QR',
        href: route('tables.index'),
        icon: QrCodeIcon,
    },
    {
        title: 'Menus',
        href: route('menu_category.index'),
        icon: UtensilsCrossed,
    },
    //restaurant/settings/general
    //restaurant/settings/finance
    //restaurant/settings/location
    {
        title: 'General settings',
        href: route('restaurant_setting.general'),
        icon: Settings,
    },
    {
        title: 'VAT, Currency, Language',
        href: route('restaurant_setting.finance'),
        icon: DollarSign,
    },
    {
        title: 'Location',
        href: route('restaurant_setting.location'),
        icon: MapPin,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
