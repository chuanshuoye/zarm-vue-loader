<script>
export default {};
</script>

## 按钮 Button

### 按钮类型
支持`default`、`primary`、`danger`三种类型，默认为`default`

`zarm-vue 为 Vue.prototype 上添加了全局方法：$zaLoading 因此在 vue instance 内可以采用
this.$zaLoading()的方式调用, 方法返回Loading的实例, 调用实例的close方法来关闭loading`。

::: demo 朴素按钮
```html
  <za-button theme="primary">普通按钮</za-button>
  <za-button theme="primary" block>块级按钮</za-button>
  <za-button theme="primary" block active>激活状态的按钮</za-button>
  <za-button theme="primary" block disabled>禁用状态的按钮</za-button>
  <script>
  export default {};
  </script>
```
:::

#### 幽灵按钮
按钮标签默认为`button`，可以使用`tag`属性来修改按钮标签

::: demo 幽灵按钮
```html
  <za-button block bordered>幽灵按钮</za-button>
  <za-button block bordered active>激活状态的按钮</za-button>
  <za-button block bordered disabled>禁用状态的按钮</za-button>
  <za-button theme="primary" block bordered>幽灵按钮</za-button>
  <za-button theme="primary" block bordered active>激活状态的按钮</za-button>
  <za-button theme="primary" block bordered disabled>禁用状态的按钮</za-button>
  <script>
  export default {};
  </script>
```
:::

### API

#### Button Attributes

| 属性 | 类型 | 默认值 | 可选值／参数 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| prefixCls | string | za-button | | 类名前缀 |
| theme | string | 'default' | 'default', 'primary', 'info', 'success', 'warning', 'error' | 主题 |
| size | string | | 'xl', 'lg', 'sm', 'xs' | 大小 |
| shape | string | | 'radius', 'round', 'circle' | 形状 |
| block | bool | false | | 是否为块级元素 |
| bordered | bool | false | | 是否是幽灵按钮 |
| disabled | bool | false | | 是否禁用 |
| loading | bool | false | | 是否显示加载中 |

#### Button Events

| 事件名称 | 说明 | 回调参数 |
| :--- | :--- | :--- |
| click | click时触发的事件 | event 事件对象 |