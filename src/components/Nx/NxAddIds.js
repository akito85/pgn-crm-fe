const nxGenerateRandomId = () =>
  crypto?.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substring(2);

export { nxGenerateRandomId };
