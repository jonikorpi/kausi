export default () => {
  try {
    if (window !== undefined && window._gauges) {
      setTimeout(() => {
        window._gauges.push(["track"]);
      }, 1000);
    }
  } catch (error) {
    console.error(error);
  }
};
