import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createNutrition } from '../../use-cases/create-nutrition'

export const createNutritionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/nutrition',
    {
      schema: {
        body: z.object({
          name: z.string(),
          weight: z.string(),
          height: z.string(),
          age: z.number(),
          gender: z.string(),
          objective: z.string(),
          level: z.string()
        }),
      },
    },
    async request => {
      const { name, weight, height, age, gender, objective, level } = request.body

      const nutrition = await createNutrition({
        name,
        weight,
        height,
        age,
        gender,
        objective,
        level
      })

      return { nutrition }
    }
  )
}