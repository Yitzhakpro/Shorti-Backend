import type { Url } from './Url';

export type NewUrlEntity = Omit<Url, 'id' | 'created_at' | 'updated_at'>;
