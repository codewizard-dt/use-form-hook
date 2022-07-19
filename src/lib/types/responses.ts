export type ErrorResponse = { error: any }
export type ApiResponse<T> = { data?: T, error?: string, errors?: { [key: string]: string } }
export type ApiResponseHandler<T> = (apiResponse: ApiResponse<T>) => Promise<ApiResponse<T>>