export default {
  changeUserInfo (state, payload) {
    state.userInfo = payload
  },
  changeKeepAliveRoutes (state, payload) {
    const keepAliveRoutes = new Set(state.keepAliveRoutes)
    if (payload.type === 'remove') {
      keepAliveRoutes.delete(payload.name)
    } else {
      keepAliveRoutes.add(payload.name)
    }
    state.keepAliveRoutes = Array.from(keepAliveRoutes)
  }
}
