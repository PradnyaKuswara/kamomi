export interface Menu {
  id: number;
  title: string;
  url: string;
  icon: string;
  orderNo: number;
  parentId?: number;
  children: Menu[];
}

export interface MenuSection {
  id: number;
  title: string;
  orderNo: number;
  menus: Menu[];
}
