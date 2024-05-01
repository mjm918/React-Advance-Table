import {Icons} from "@/components/ui/icons";

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
	icon?: keyof typeof Icons;
	href: string;
	items: SidebarNavItem[];
};