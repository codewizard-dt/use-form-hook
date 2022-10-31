
import { AxiosResponse } from "axios"
import { FormResponse } from "../types"

export function responseTransformer<T = unknown>({ data: { data, error, errors } }: AxiosResponse<FormResponse<T>>) {
  return { data, error, errors }
}