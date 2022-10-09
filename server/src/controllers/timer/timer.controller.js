function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // event loop is blocked
  }
}

function httpGetDelay(req, res) {
  delay(5000);
  res.status(200).send(`Permance delayed! ${process.pid}`);
}

export { httpGetDelay };
