export type PartenairesType = {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'ACTIVE' | 'INACTIVE';
}