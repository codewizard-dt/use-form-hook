
import { AxiosResponse, AxiosResponseTransformer } from "axios"
import { ApiResponse } from "../types"

export const parseJson: AxiosResponseTransformer = (data, headers) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}
export function responseHandler<T = unknown>({ data: { data, error, errors } }: AxiosResponse<ApiResponse<T>>) {
  return { data, error, errors }
}