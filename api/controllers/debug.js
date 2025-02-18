// The TRACE method is generally used for diagnostic purposes. It echoes back whatever the client sends in the request body, allowing the client to see what it sent and what the server received.

export const traceRequest = (req, res) => {
    // Send back the request's content as a response
    res.status(200).send({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
  };
  