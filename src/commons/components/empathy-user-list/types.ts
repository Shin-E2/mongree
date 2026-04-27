export interface IEmpathyUserListProps {
  empathies: {
    id: string;
    user: {
      profile_image: string | null;
      username?: string | null;
    } | null;
  }[];
  maxCount?: number;
  className?: string;
}