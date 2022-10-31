import { ApiFormData } from "../../context/form"

/**
 * The structure of the API response expected
 */
export type FormResponse<T = any> = {
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
export type FormSubmitHandler<T = any> = (data: ApiFormData) => Promise<FormResponse<T>>
/**
 * Defines the `respond` property which receives the FormResponse
 */
export type FormResponseHandler<T = any> = (response: T) => void
