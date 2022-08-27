import { Field, FieldGroup } from '../../../dist/esm/types/context/form';
import { ApiFormData } from '../../context/form';
import { getFlatObj } from '../dot-notation';
import { getFlatFields } from './getFlatFields';

export default function (initial: ApiFormData, data: ApiFormData): boolean {
  const flatData = getFlatObj(data)
  for (let key in initial) {
    if (initial[key] !== flatData[key]) return true
  }
  return false
}