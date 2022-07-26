import { Field, FieldGroup } from '../../../dist/esm/types/context/form';
import { ApiFormData } from '../../context/form';
import { getFlatObj } from '../dot-notation';
import { getFlatFields } from './getFlatFields';

export default function (fields: (Field & FieldGroup)[], data: ApiFormData): boolean {
  const flatInitialValues = getFlatFields(fields)
  const flatData = getFlatObj(data)
  for (let key in flatInitialValues) {
    if (flatInitialValues[key] !== flatData[key]) return true
  }
  return false
}