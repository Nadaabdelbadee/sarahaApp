



export const validate = (schema) => {
  return (req, res, next) => {
    let validationError = [];
    for (const key of Object.keys(schema)) {
      const confirmValidation = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (confirmValidation?.error) {
        validationError.push(confirmValidation.error.details)
      }
    }
    if (validationError.length>0) {
      // return next(new Error("validation error" , {cause:400}))
        return res.status(400).json({msg:"validation error" ,  error: validationError });
        
    }
    next();
  };
};
