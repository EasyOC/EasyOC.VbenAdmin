import {
  ContentPartDefinitionDto,
  ContentPartFieldDefinitionDto,
  ContentTypeDefinitionDto,
} from '../app-service-proxies';
import { BasicColumn } from '/@/components/Table';

export class ContentHelper {
  public getColumns(
    def: ContentTypeDefinitionDto | ContentPartDefinitionDto | any,
    rootPath = '',
  ): BasicColumn[] {
    if (def instanceof ContentTypeDefinitionDto) {
      return this.getColumnsFromType(def as ContentTypeDefinitionDto, rootPath);
    } else {
      return this.getColumsFromPart(def as ContentPartDefinitionDto, rootPath);
    }
  }

  public getColumsFromPart(partDef: ContentPartDefinitionDto, parentPath = ''): BasicColumn[] {
    const cols: BasicColumn[] = [];
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.';
    }
    const dataPath = parentPath;
    partDef.fields?.forEach((x) => {
      const col: BasicColumn = {
        title: x.displayName,
        dataIndex: x.name || '',
      };

      const valuePath = this.buildPath(x.fieldDefinition.name);

      col.dataIndex = `${dataPath}${x.name}.${valuePath}`.split('.');
      cols.push(col);
    });
    return cols;
  }

  public getColumnsFromType(typeDef: ContentTypeDefinitionDto, parentPath = ''): BasicColumn[] {
    const cols: BasicColumn[] = [];
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.';
    }
    const dataPath = parentPath;
    typeDef.parts?.forEach((x) => {
      if (x.partDefinition.name == 'TitlePart') {
        cols.push({
          title: 'DisplayName',
          dataIndex: dataPath + 'TitlePart.Title',
        });
      } else {
        cols.push(...this.getColumsFromPart(x.partDefinition, `${dataPath}${x.name}`));
      }
    });
    return cols;
  }

  public buildPath(fieldName: string | null) {
    let valuePath = 'Value';
    switch (fieldName) {
      case 'TextField':
        valuePath = 'Text';
        break;
      case 'BooleanField':
        valuePath = 'Value';
        break;
      case 'DateField':
        valuePath = 'Value';
        break;
      case 'TimeField':
        valuePath = 'Value';
        break;
      case 'Date&Timefield':
        valuePath = 'Value';
        break;
      case 'NumericField':
        valuePath = 'Value';
        break;
    }
    return valuePath;
  }
  public getColumnsFromUserProperties(
    userProperties: ContentTypeDefinitionDto[],
    parentPath = 'properties.',
  ): BasicColumn[] {
    const cols: BasicColumn[] = [];
    if (!!parentPath && !parentPath.endsWith('.')) {
      parentPath = parentPath + '.';
    }
    console.log(userProperties, 'adsuserPropertiesuserPropertiesfasdgasdgasdgasd');

    userProperties.forEach((x) =>
      cols.push(...this.getColumnsFromType(x, `${parentPath}${x.name}`)),
    );
    return cols;
  }
}
