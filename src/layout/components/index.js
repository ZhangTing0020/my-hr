// 导入的是组件Navbar中的default  ,给default起个别名Navbar

// 导出的是Navbar
export { default as Navbar } from './Navbar'
export { default as Sidebar } from './Sidebar'
export { default as AppMain } from './AppMain'

// es6模块化,导入成员,可以取一个别名
// import {list as list1} from 'a.js'
// import {list as list2} from 'b.js'

// 针对ES6的默认导出,可以在导入的时候,任意起别名
// import Navbar from './Narbar'
// import { default as Abc } from './Narbar'

// export default { Abc }

// import { Abc } from 'a.js'

