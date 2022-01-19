export interface IHasChildren<T> {
  children?: IHasChildren<T>[] | undefined
}

/**
 * 自定义树形解构转换
 * @description
  const nodeBuilder = new TreeNodeBuilder(
      deptList,
      (item) => {
        return !item.parentId
      },
      (parent, node) => {
        return node.parentId == parent.id
      },
    )
    const result = nodeBuilder.buildDataNode()
 */
export class TreeNodeBuilder<T> {
  public ls: Array<IHasChildren<T>> = []
  constructor(
    list: Array<T>,
    rootFinderFn: (item: T) => boolean,
    childFinderFn: (parent: T, node: T) => boolean,
  ) {
    this.ls = list.map((x) => {
      return Object.assign({} as IHasChildren<T>, x)
    })
    this.rootFinderFn = rootFinderFn
    this.childFinderFn = childFinderFn
  }

  rootFinderFn!: (item: T) => boolean
  childFinderFn!: (parent: T, node: T) => boolean

  public buildDataNode(): IHasChildren<T> {
    const rootItem = this.ls.find((x) =>
      this.rootFinderFn(x as T),
    ) as IHasChildren<T>
    this.getChildren(rootItem)
    return rootItem
  }

  public getChildren(item: IHasChildren<T>) {
    const children = this.ls.filter((x) =>
      this.childFinderFn(item as T, x as T),
    )
    if (children) {
      children.forEach((element) => {
        this.getChildren(element)
      })
      item.children = children
    }
  }
}
