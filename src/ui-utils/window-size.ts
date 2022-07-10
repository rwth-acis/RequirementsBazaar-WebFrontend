import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function useWindowSize() {
  // state encapsulated and managed by the composable
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);


  // a composable can update its managed state over time.
  const onResize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => {
    window.addEventListener('resize', onResize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  // expose managed state as return value
  return { windowWidth, windowHeight };
}
