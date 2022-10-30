import { Axios, AxiosRequestConfig, AxiosRequestTransformer } from "axios";
import { ApiResponse } from "../types";
import { parseJson, responseHandler } from "./AxiosMethods";

export type AxiosPost = typeof Axios.prototype.post
export type AxiosGet = typeof Axios.prototype.get
export type AxiosDelete = typeof Axios.prototype.delete
export type AxiosPatch = typeof Axios.prototype.patch

export class AxiosApi {
  addAuthHeader: AxiosRequestTransformer = (data, headers) => {
    if (this.authTokenName) {
      let token = localStorage.getItem(this.authTokenName)
      if (token) headers.set('Authorization', token)
      if (typeof data !== 'string') {
        headers.set('Content-Type', 'application/json')
        data = JSON.stringify(data)
      }
    }
    return data
  }
  private defaultConfig = {
    baseURL: '/api',
    transformResponse: parseJson,
    transformRequest: this.addAuthHeader,
  }
  private axios: Axios;
  constructor(private authTokenName?: string, config?: AxiosRequestConfig) {
    this.axios = new Axios({ ...this.defaultConfig, ...config })
  }

  async post<T>(...args: Parameters<AxiosPost>) {
    return this.axios.post<ApiResponse<T>>(...args).then(responseHandler<T>)
  }
  async get<T>(...args: Parameters<AxiosGet>) {
    return this.axios.get<ApiResponse<T>>(...args).then(responseHandler<T>)
  }
  async delete<T>(...args: Parameters<AxiosDelete>) {
    return this.axios.post<ApiResponse<T>>(...args).then(responseHandler<T>)
  }
  async patch<T>(...args: Parameters<AxiosPatch>) {
    return this.axios.post<ApiResponse<T>>(...args).then(responseHandler<T>)
  }
}

// export default AxiosApi
