import { ListProps } from "./types";

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  containerClassName,
  itemClassName,
}: ListProps<T>) {
  if (!items || items.length === 0) {
    return null; // 또는 "데이터가 없습니다" 등의 메시지 반환
  }

  return (
    <div className={containerClassName}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
