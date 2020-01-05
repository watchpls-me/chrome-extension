import PageIndex from './pages/Index'
import Settings from './pages/Settings'

export default [
  {
    path: '/',
    name: 'index',
    component: PageIndex
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  }
]
