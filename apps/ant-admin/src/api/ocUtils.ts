import { FormSchema } from "@/components/form"
import { clone, get, has, set } from "@pkg/utils"

export function expandComplexModel(model: any, schemas: FormSchema[]) { 
  //克隆新的对象
  const res: any = clone(model)
  //复杂对象展开
  schemas.filter(x => x.fieldMap && !!x.fieldMap.mapTo).forEach((schema) => {
    if (schema.fieldMap) {
      const item = schema.fieldMap
      if (has(res, item.mapTo)) {
        res[schema.field] = get(res, item.mapTo)
      }
    }
  })
  console.log("expanded model", res)
  return res
}

export function restoreComplexModel(model: any, schemas: FormSchema[]) {
  //克隆为新的对象，避免保存失败后，原对象被修改
  const res: any = clone(model) //复杂对象恢复
  schemas.filter(x => x.fieldMap && !!x.fieldMap.mapTo)
    .forEach(schema => {
      if (schema.fieldMap) {
        set(res, schema.fieldMap.mapTo, res[schema.field])
      }
    })
  console.log(res, "NewData")
  return res
}