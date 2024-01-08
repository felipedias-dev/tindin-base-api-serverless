import axios from '@/lib/axios'

/**
 * Na API do Pexels, você recebe um cabeçalho de resposta com as seguintes informações:
 * X-Ratelimit-Limit = Seu limite total de solicitações mensais
 * X-Ratelimit-Remaining = Quantas dessas solicitações ainda não foram usadas
 * X-Ratelimit-Reset = Registro de data e hora UNIX que indica quando o período mensal atual será renovado
 *
 * Uma possível solução para o problema de limite de requisições seria armazenar essas informações
 * no banco de dados ou no Redis e fazer uma verificação antes de cada requisição.
 * Se o limite de requisições já tiver sido atingido, a requisição só poderá ser feita novamente
 * após o período de renovação (X-Ratelimit-Reset).
 */

const listPhotos = async ({ page, perPage, search }) => {
  const pexels = axios.create({
    baseURL: 'https://api.pexels.com/v1',
    headers: {
      Authorization: process.env.PEXELS_API_KEY
    }
  })

  const response = await pexels.get(`/search?query=${search}&per_page=${perPage}&page=${page}`)

  return response.data
}

const contentsPhotoService = {
  listPhotos
}

export {
  contentsPhotoService
}
