import { reactive, computed } from "vue";

interface State {
    loading: boolean,
}

const state = reactive<State>({
    loading: false,
});

const startLoading = () => {
    setLoading(true);
}

const stopLoading = () => {
    setLoading(false);
}

const setLoading = (loading: boolean) => {
    state.loading = loading;
}

export const useProgress = () => {
    return {
        isLoading: computed(() => state.loading),
        // methods
        setLoading,
        startLoading,
        stopLoading,
    }
}
