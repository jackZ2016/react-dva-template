
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    darkTheme: localStorage.getItem('darkTheme') === 'true',
  },

  effects: {

  },

  reducers: {
    switchTheme(state) {
      localStorage.setItem('darkTheme', !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    }
  }
};
