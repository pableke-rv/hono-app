
export type ItemType = {
    label: string;
    value: string;
}

export type AlertType = {
    type: string;
    icon?: string;
    children: (string | JSX.Element | JSX.Element)[];
}

export type TabType = {
    id: string;
    active?: string;
    title: string;
    children: JSX.Element | JSX.Element[];
}
