<template>
  <Card title="最新动态" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>
    <List item-layout="horizontal" :data-source="dynamicInfoItems">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta>
            <template #description>
              {{ item.date }}
            </template>
            <template #title>
              <!-- eslint-disable-next-line -->
              {{ item.name }} <span v-html="item.desc"> </span>
            </template>
            <template #avatar>
              <Icon :icon="item.avatar" :size="30" />
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Card>
</template>
<script lang="ts" setup>
import { Card, List } from 'ant-design-vue'
import { dynamicInfoItems } from './data'
import { Icon } from '@components/common'

const ListItem = List.Item
const ListItemMeta = List.Item.Meta
</script>
