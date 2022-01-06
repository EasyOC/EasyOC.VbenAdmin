import { ContentPartDefinitionDto, ContentTypeDefinitionDto } from '../app-service-proxies';
import { BasicColumn } from '/@/components/Table';

export class ContentHelper {
  getColumns(def: ContentTypeDefinitionDto | ContentPartDefinitionDto | any): BasicColumn[] {
    if (def instanceof ContentTypeDefinitionDto) {
      return this.getColumnsFromType(def as ContentTypeDefinitionDto);
    } else {
      return this.getColumsFromPart(def as ContentPartDefinitionDto);
    }
  }

  public getColumsFromPart(partDef: ContentPartDefinitionDto): BasicColumn[] {
    const cols: BasicColumn[] = [];
    partDef.fields?.forEach((x) => {
      cols.push({
        title: x.displayName,
        dataIndex: x.name,
      });
    });
    return cols;
  }
  getColumnsFromType(typeDef: ContentTypeDefinitionDto): BasicColumn[] {
    const cols: BasicColumn[] = [];
    typeDef.parts?.forEach((x) => cols.push(...this.getColumsFromPart(x.partDefinition)));
    return cols;
  }
}
