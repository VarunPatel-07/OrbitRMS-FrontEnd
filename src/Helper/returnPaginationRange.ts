const range = (start: number, end: number) => {
  return Array.from({ length: end - start }, (_, i) => i + start);
};

export const returnPaginationRang = (
  totalPage: number,
  page: number,
  siblings: number
) => {
  const totalPageNoInArray = 7 + siblings;
  if (totalPageNoInArray >= totalPage) {
    return range(1, totalPage + 1);
  }
  const leftSiblingsIndex = Math.max(page - siblings, 1);
  const rightSiblingsIndex = page + siblings;
  const showLeftDots = leftSiblingsIndex > 2;
  const showRightDots = rightSiblingsIndex < totalPage - 2;
  if (!showLeftDots && showRightDots) {
    const leftItemsCount = 3 + 2 * siblings;
    const leftRang = range(1, leftItemsCount + 1);
    return [...leftRang, '...', totalPage];
  } else if (showLeftDots && !showRightDots) {
    const rightItemsCount = 3 + 2 * siblings;
    const rightRange = range(totalPage - rightItemsCount + 1, totalPage + 1);
    return [1, '...', ...rightRange];
  } else {
    const middleRange = range(leftSiblingsIndex, rightSiblingsIndex + 1);
    return [1, '...', ...middleRange, '...', totalPage];
  }
};
