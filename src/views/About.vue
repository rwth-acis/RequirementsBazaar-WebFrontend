<template>

  <h1>About</h1>

  <p class="p-mb-3">
    <i>Please note, that this resource is currently only available in English. We are sorry for any inconveniences!
    </i>
  </p>

  <p>Requirements Bazaar is a web-based tool for continuous innovation through stakeholder participation. It is a
    research prototype built at RWTH Aachen University which is open for the general public. It builds
    on the principles of social requirements engineering, which allows communities to express, discuss and
    prioritize their requirements and trace their realization in a way known from social networking.</p>

  <p>On this page, we give you some links to our research and the source.</p>

  <h2>Research</h2>

  <p>Here is a non-comprehensive list of research articles that we have published over the last years.</p>

  <ul>
    <li>
      Requirements Bazaar: Experiences, Added-Value and Acceptance of Requirements Negotiation between End-Users and
      Open Source Software Developers. Published in Software Engineering & Management 2015, Dresden, March 17-20,
      2015, Lecture Notes in Informatics (LNI) 239, 122-123 by Dominik Renzel, Ralf Klamma, Matthias Jarke</li>
    <li>
      Requirements Bazaar: Social Requirements Engineering for Community-Driven Innovation. Published in 2013 21st
      IEEE International Requirements Engineering Conference (RE) Proceedings (Best Tool Demo Award) by Dominik
      Renzel, Malte Behrendt, Ralf Klamma, Matthias Jarke
    </li>
    <li>
      Der Bazar der Anforderungen - Open Innovation in emergenten Communities. Published in Informatik-Spektrum
      Volume 34(2):178-191, Springer Berlin/Heidelberg, DOI 10.1007/s00287-010-0516-5 by Ralf Klamma, Matthias
      Jarke, Anna Hannemann, Dominik Renzel
    </li>
  </ul>

  <h2>How to Contribute</h2>

  <p>If you are convinced about Requirements Bazaar and want to participate, you are more than welcome! First option
    to add your ideas would be the <a href="https://requirements-bazaar.org/projects/2" target="_blank">Requirements
      Bazaar project</a> here in Requirements Bazaar. ;) You may also help us by issuing a pull request to one of
    our open source repositories, by sending us design proposals, or by volunteering to translate the page to one of
    your native languages. Simply drop us an email at reqbaz@dbis.rwth-aachen.de and tell us about your idea.</p>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'About',
  props: {
  },
  setup: () => {
    return {}
  }
})
</script>

<style scoped>
</style>
