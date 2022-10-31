import { Axios, AxiosRequestConfig, AxiosResponse, AxiosResponseTransformer } from 'axios';
import { FormResponse } from "../types";
import { jsonRequest, jsonResponse, responseHandler } from "./AxiosMethods";

export type AxiosPost = typeof Axios.prototype.post
export type AxiosGet = typeof Axios.prototype.get
export type AxiosDelete = typeof Axios.prototype.delete
export type AxiosPatch = typeof Axios.prototype.patch

// export function responseHandler<T = unknown>({ data: { data, error, errors } }: AxiosResponse<FormResponse<T>>) {
//   return { data, error, errors }
// }

export class FormHandler {
  private defaultConfig: AxiosRequestConfig = {
    responseType: 'json',
    transformRequest: jsonRequest,
    transformResponse: jsonResponse
  }
  private axios: Axios;
  constructor(config?: AxiosRequestConfig) {
    this.axios = new Axios({ ...this.defaultConfig, ...config })
  }

  async post<T>(...args: Parameters<AxiosPost>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseHandler<T>)
  }
  async get<T>(...args: Parameters<AxiosGet>) {
    return this.axios.get<FormResponse<T>>(...args).then(responseHandler<T>)
  }
  async delete<T>(...args: Parameters<AxiosDelete>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseHandler<T>)
  }
  async patch<T>(...args: Parameters<AxiosPatch>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseHandler<T>)
  }
}

// export default AxiosApi
