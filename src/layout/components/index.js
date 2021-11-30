// 导入default选项，起一个别名(as之后的名字)，然后再导出
export { default as Navbar } from './Navbar'
export { default as Sidebar } from './Sidebar'
export { default as AppMain } from './AppMain'

// 针对ES6的默认导出可以在导入时，任意命名
// import Navbar from './Navbar'
// import { default } from './Navbar'

// ES6模块化导入成员可以起一个别名
// import { list as list1 } from 'a.js'
// import { list as list2 } from 'b.js'
