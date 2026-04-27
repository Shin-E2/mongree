export interface IEmpathyUserListProps {
  empathies: {
    id: string;
    user: {
      profile_image: string | null;
      nickname?: string | null;
    } | null;
  }[];
  maxCount?: number;
  className?: string;
}
