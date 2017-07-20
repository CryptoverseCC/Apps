
export const throwErrorOnNotOkResponse = (response: Response): Response | PromiseLike<Response> => {
  if (response.ok) {
    return response;
  }
  return response
    .text()
    .then((responseText) => {
      throw new Error(responseText);
    });
};
