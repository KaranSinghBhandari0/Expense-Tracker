function validateBody(allowedFields) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Request body must be a JSON object.',
        errors: []
      });
    }

    const unexpected = Object.keys(req.body).filter((key) => !allowedFields.includes(key));
    if (unexpected.length) {
      return res.status(400).json({
        success: false,
        message: 'Request contains unsupported fields.',
        errors: unexpected.map((field) => ({ field, message: 'Unsupported field.' }))
      });
    }

    return next();
  };
}

module.exports = { validateBody };
