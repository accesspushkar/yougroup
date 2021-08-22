const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const shouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
  const bottomBorder = (scrollHeight - clientHeight) / 2;
  return bottomBorder < scrollTop;
};

export default {
  sleep,
  shouldLoadMore,
};
