import { ApiFormData, Field, FieldGroup } from '../../context/form';
import { getFlatObj } from '../dot-notation';

export default function (initial: ApiFormData, data: ApiFormData): boolean {
  const flatData = getFlatObj(data)
  for (let key in initial) {
    if (initial[key] !== flatData[key]) return true
  }
  return false
}