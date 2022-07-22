import { ApiFormData } from "../../context/form"

/**
 * The structure of the API response expected
 */
export type ApiResponse<T> = {
  data?: T,
  error?: any,
  errors?: {
    [key: string]: string
  }
}


/**
 * Defines the `submit` property which sends the form data to the Api 
 * Must return a promise
 */
export type FormSubmitHandler = (data: ApiFormData) => Promise<ApiResponse<any>>
/**
 * Defines the `respond` property which receives the ApiResponse
 */
export type ApiResponseHandler<T> = (response: ApiResponse<T>) => void
