export interface ITagListProps {
  tags: ({ id: string; name: string } | { tag: { id: string; name: string } })[];
  className?: string;
}
