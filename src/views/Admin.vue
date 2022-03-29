<template>
  <div v-if="oidcIsAuthenticated">
      <!-- TODO Only display if user has role SystemAdmin -->
      <h1>Administration Settings</h1>

      <p>
          You can only use these options if you have the <i>SystemAdmin</i> role!
      </p>

      <section>
          <h2>Linked Twitter Account</h2>
          <p>
              Use this operation to link a Twitter account so Requirements Bazaar can tweet about new projects etc. automatically.
          </p>
          <div class="p-my-3">
              <Button label="Link Twitter Account" icon="pi pi-link" class="p-button-success" @click="initTwitterAuthorization" />
              <Button label="Post Test Tweet" icon="pi pi-twitter" class="p-button-warning p-mx-5" @click="postTestTweet" />
              <Button label="Manually Tweet about this weeks new projects" icon="pi pi-twitter" class="p-button-info p-mx-5" @click="triggerNewProjectsTweet" />
          </div>
          <div>
              <h5>Test Output</h5>
              <div v-for="line in testOutput" :key="line">{{ line }}</div>
          </div>
      </section>
  </div>

  <div v-else>
      <h1>Not authorized!</h1>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { bazaarApi } from '@/api/bazaar';

export default defineComponent({
  name: 'Admin',
  components: {
  },
  props: {
  },
  setup: () => {
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const oidcIsAuthenticated = computed(() => store.getters['oidcStore/oidcIsAuthenticated']);
    const oidcUser = computed(() => store.getters['oidcStore/oidcUser']);

    const initTwitterAuthorization = async () => {
        const response = await bazaarApi.admin.authorizeTwitterAccount();

        console.log(response);

        const redirectURI = response.data.redirectUrl;

        window.open(redirectURI);
    };

    const testOutput = ref<string[]>([]);

    const postTestTweet = async () => {
        testOutput.value.push('Posting test tweet...');
        const response = await bazaarApi.admin.postTestTweet();

        testOutput.value.push('Posted Tweet (response: status: ' + response.status + ', data:' + response.data + ')');
    };

    const triggerNewProjectsTweet = async () => {
        testOutput.value.push('Triggering Tweet...');
        bazaarApi.admin.triggerNewProjectsTweet()
            .then(response => testOutput.value.push('Triggered weekly Tweet manually. (response: status: ' + response.status + ', data:' + response.data + ')'))
            .catch(response => {
                testOutput.value.push('Error from API: (response: status: ' + response.status + ', data:' + response.data + ')');
            });
    };

    return {
      t,
      oidcIsAuthenticated,
      oidcUser,
      testOutput,
      initTwitterAuthorization,
      postTestTweet,
      triggerNewProjectsTweet,
    };
  }
})
</script>

<style scoped>
</style>
