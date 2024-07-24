import { watch } from 'vue';

export function usePersistedState(store, key) {
  watch(
    () => store.$state,
    (state) => {
      localStorage.setItem(key, JSON.stringify(state));
    },
    { deep: true }
  );

  const savedState = localStorage.getItem(key);
  if (savedState) {
    store.$patch(JSON.parse(savedState));
  }
}
