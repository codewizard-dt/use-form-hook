
import { AxiosRequestTransformer, AxiosResponse, AxiosResponseTransformer } from "axios"
import { FormResponse } from "../types"

export const jsonRequest: AxiosRequestTransformer = (data, headers) => {
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
    headers.setContentType('application/json')
  }
  return data
}
export const jsonResponse: AxiosResponseTransformer = (data, headers) => {
  try {
    data = JSON.parse(data)
    return data
  } catch (error) {
    return data
  }
}
export function responseHandler<T = unknown>({ data: { data, error, errors } }: AxiosResponse<FormResponse<T>>) {
  return { data, error, errors }
}