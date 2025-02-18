// The OPTIONS method is used to check the allowed methods for a particular resource.

export const optionsHandler = (req, res) => {
    // Return the allowed methods for the resource
    res.status(200).send({
      allowedMethods: ["GET", "POST", "PUT", "DELETE"],
    });
  };
  