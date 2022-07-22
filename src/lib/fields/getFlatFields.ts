import { Field, FieldGroup } from '../../context'
import { getFlatObj } from '../dot-notation'
import { getBranchedTree } from './buildTree'

export function getFlatFields(fields: (Field & FieldGroup)[]) {
  return getFlatObj(getBranchedTree(fields))
}