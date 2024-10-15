import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../env'

interface CreateNutritionRequest {
  name: string
  weight: string
  height: string
  age: string
  gender: string
  objective: string
  level: string
}

export async function createNutrition({
  name,
  weight,
  height,
  age,
  gender,
  objective,
  level
}: CreateNutritionRequest) {
  try {
    const generativeAI = new GoogleGenerativeAI(env.API_KEY)
    const model = generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
    Crie uma dieta completa para uma pessoa com as seguintes características:
    - Nome: ${name}
    - Sexo: ${gender}
    - Peso: ${weight} kg
    - Altura: ${height} cm
    - Idade: ${age} anos
    - Objetivo: ${objective}
    - Nível de atividade: ${level}

    Retorne o resultado em JSON com as seguintes propriedades:
    - nome: o nome da pessoa
    - sexo: o sexo da pessoa
    - idade: a idade da pessoa
    - altura: a altura da pessoa
    - peso: o peso da pessoa
    - objetivo: o objetivo atual
    - refeicoes: uma array contendo objetos para cada refeição, com as propriedades:
        - horario: o horário da refeição
        - nome: o nome da refeição
        - alimentos: array com os alimentos recomendados para a refeição, refeições estas: "Café da manhã", "Lanche da manhã", "Almoço", "Lanche da tarde" e "Jantar"
    - suplementos: array com sugestão de suplementos e quantidades para o sexo e objetivo da pessoa

    Não inclua observações extras. Use a tabela de referência para calcular as necessidades nutricionais.
  `.trim()

    const response = await model.generateContent(prompt)

    if (response.response && response.response.candidates) {
      const candidate = response.response.candidates[0]?.content.parts[0].text as string

      const cleanedData = cleanResponse(candidate)

      const data = parseJson(cleanedData)

      return data
    }
  } catch (error) {
    console.error(error)

    throw new Error("Failed create.")
  }
}

function cleanResponse(response: string): string {
  return response
    .replace(/```\w*\n/g, '') // Remove possíveis blocos de código de linguagens
    .replace(/\n```/g, '')    // Remove fechamento de blocos de código
    .trim()                   // Remove espaços desnecessários
}

function parseJson(data: string): any {
  try {
    return JSON.parse(data)
  } catch (error) {
    throw new Error("Failed to parse JSON from response.")
  }
}
