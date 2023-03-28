import Joi from 'joi'

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(24).required(),
    // email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  })
  return schema.validate(data)
}

const newUserValidation = (data) => {
  const schema = Joi.object({
    userType: Joi.string().required(),
    username: Joi.string().min(4).max(24).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.number(),
  })
  console.log(`from loginValidation: ${data}`)
  console.log(data)
  return schema.validate(data)
}

export { loginValidation, newUserValidation }
