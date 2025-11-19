export type NavButtonType = 'normal' | 'login' | 'logout' | 'circle';

export interface Props {
    type?: NavButtonType;
    url: string;
    text: string;
}

export interface DropDownProps {
    label: string;
    items: Array<Props>;
}