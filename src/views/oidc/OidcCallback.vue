<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OidcCallback',
  methods: {
    ...mapActions('oidcStore', [
      'oidcSignInCallback'
    ])
  },
  created () {
    this.oidcSignInCallback()
      .then((redirectPath) => {
        console.log('OIDC SingInCallback called with rediectPath: ' + redirectPath);
        this.$router.push(redirectPath)
      })
      .catch((err) => {
        console.log('OIDC SingInCallback error caught:');
        console.error(err)
        this.$router.push('/oidc-callback-error') // Handle errors any way you want
      })
  }
}
</script>
