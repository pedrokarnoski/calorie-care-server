import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { createNutritionRoute } from './routes/create-nutrition'
import fastifyCors from '@fastify/cors'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createNutritionRoute)

app
  .listen({
    port: 3333,
    host: "0.0.0.0"
  })
  .then(() => {
    console.log('Server running on http://localhost:3333')
  })
