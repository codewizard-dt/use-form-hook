import { Axios, AxiosRequestConfig } from 'axios';
import { FormResponse } from "../types";
import { responseTransformer } from './AxiosMethods';

export type AxiosPost = typeof Axios.prototype.post
export type AxiosGet = typeof Axios.prototype.get
export type AxiosDelete = typeof Axios.prototype.delete
export type AxiosPatch = typeof Axios.prototype.patch

export class FormHandler {
  private defaultConfig: AxiosRequestConfig = {
    responseType: 'json',
  }
  private axios: Axios;
  constructor(config?: AxiosRequestConfig) {
    this.axios = new Axios({ ...this.defaultConfig, ...config })
  }

  async post<T>(...args: Parameters<AxiosPost>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseTransformer<T>)
  }
  async get<T>(...args: Parameters<AxiosGet>) {
    return this.axios.get<FormResponse<T>>(...args).then(responseTransformer<T>)
  }
  async delete<T>(...args: Parameters<AxiosDelete>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseTransformer<T>)
  }
  async patch<T>(...args: Parameters<AxiosPatch>) {
    return this.axios.post<FormResponse<T>>(...args).then(responseTransformer<T>)
  }
}
