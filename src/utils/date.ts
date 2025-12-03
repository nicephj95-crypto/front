export const formatDistanceToNow = (isoDate: string): string => {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - target, 0);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}일 전`;
  }
  if (diffHours > 0) {
    return `${diffHours}시간 전`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes}분 전`;
  }
  return "방금 전";
};
