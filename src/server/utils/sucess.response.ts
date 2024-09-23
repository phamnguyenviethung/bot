class SuccessResponse {
  constructor(private data: any, private message: string = 'ok') {}

  send(res) {
    return res.status(200).json({ message: this.message, data: this.data });
  }
}

module.exports = (res: any, data: any, message?: string) => {
  return new SuccessResponse(data, message).send(res);
};
