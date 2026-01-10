export interface PalavraModel {
    id: string;
    word: string;
    translation: string;
    created_at?: string;
    favorite?: boolean;
}