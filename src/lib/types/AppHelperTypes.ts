import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query"

export type QueryKey = (string | number | undefined | null)[]

export type QueryKeys<T> = {
  listQueryKey: QueryKey
  listIndex: keyof T extends string | number ? keyof T : never
  singleQueryKey?: QueryKey
}

export type AppQueryOptions<T> = UseQueryOptions<T | null>

export type AppMutationOptions<T, V = void> = UseMutationOptions<T | null, unknown, V>

export type PatchOptions<TData> = AppMutationOptions<TData, Partial<TData>>

export type DeleteOptions<TData, TResponse = any, TVariable = any> = AppMutationOptions<TResponse, TVariable> & {
  onDelete?: (item: TData | null) => void
}
