export function formatToTimeAgo(date: string): string {
  const now = new Date();
  const time = new Date(date);
  const diffInMs = time.getTime() - now.getTime(); // 현재 시간과 입력된 시간의 차이 (밀리초 단위)
  const diffInSec = Math.round(diffInMs / 1000); // 초 단위로 변환
  const diffInMin = Math.round(diffInSec / 60); // 분 단위로 변환
  const diffInHour = Math.round(diffInMin / 60); // 시간 단위로 변환
  const diffInDay = Math.round(diffInHour / 24); // 일 단위로 변환
  const diffInMonth = Math.round(diffInDay / 30); // 대략적인 월 단위로 변환
  const diffInYear = Math.round(diffInMonth / 12); // 대략적인 년 단위로 변환

  const formatter = new Intl.RelativeTimeFormat("ko"); // 한국어 상대 시간 포맷터

  // 조건에 따라 적절한 단위를 선택하여 반환
  if (diffInYear !== 0) {
    return formatter.format(diffInYear, "year"); // 년 단위
  } else if (diffInMonth !== 0) {
    return formatter.format(diffInMonth, "month"); // 월 단위
  } else if (diffInDay !== 0) {
    return formatter.format(diffInDay, "day"); // 일 단위
  } else if (diffInHour !== 0) {
    return formatter.format(diffInHour, "hour"); // 시간 단위
  } else if (diffInMin !== 0) {
    return formatter.format(diffInMin, "minute"); // 분 단위
  } else {
    return formatter.format(diffInSec, "second"); // 초 단위
  }
}
