export type ErrorResponse = { error: any }
export type ApiData<T> = { data?: T, error?: string, errors?: { [key: string]: string } }
export type ApiResponseHandler<T> = (apiResponse: ApiData<T>) => Promise<ApiData<T>>