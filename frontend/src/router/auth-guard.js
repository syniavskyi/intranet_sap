import store from '../store/store'

export default (to, from, next) => {
    if (to.name === 'Login'){
        next()
    } else {
        if (localStorage.getItem('token')) {
            next()
        } else {
            next('/')
        }
    }
}