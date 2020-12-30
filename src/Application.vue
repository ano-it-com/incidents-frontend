<template>
  <div :id="$options.name" :class="[$options.name]">
    <header-layout
      v-if="isAuth && !isIncidentCreation"
    />

    <main
      id="content"
      :class="mainClasses"
    >
      <router-view v-if="isResolved" />
    </main>

    <no-ssr>
      <action-with-comment-modal />
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import get from 'lodash/get';
import ActionWithCommentModal from '@/components/modals/ActionWithCommentModal.vue';
import HeaderLayout from './components/layouts/Header.vue';

const DEFAULT_TITLE = 'Система инцидентов';

export default {
  name: 'app',
  components: {
    HeaderLayout,
    ActionWithCommentModal,
  },
  metaInfo: {
    titleTemplate: (title) => (title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      {
        rel: 'stylesheet',
        crossorigin: 'crossorigin',
        href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Ruda:wght@400;500;600;700;800;900&display=swap',
      },
    ],
  },
  data: () => ({
    isResolved: false,
  }),
  computed: {
    ...mapGetters(['isAuth', 'profile']),
    ...mapState('system', ['layoutIsOpen']),

    isIncidentCreation() {
      return ['incidents-create', 'incidents-edit'].includes(this.$route.name);
    },

    mainClasses() {
      return [
        get(this.$route, 'meta.layout', 'layout-1'),
        {
          main: true,
          open: this.layoutIsOpen || ['incidents-list-side-incident', 'incidents-list-side-incident-action'].includes(this.$route.name),
        },
      ];
    },
  },
  async mounted() {
    // this.applicationLayout = get(this.$route, 'meta.layout', 'default-layout');
    const actions = [];

    console.log(this.isAuth, this.profile);

    try {
      if (this.isAuth) {
        actions.push(this.userProfile());
        actions.push(this.getMeta());
      }

      await Promise.all(actions);
    } catch (e) {
      // console.log(e);
    } finally {
      this.$router.onReady(() => { this.isResolved = true; });
    }
  },
  methods: {
    ...mapActions('incidents', ['getMeta']),
    ...mapActions(['userProfile']),
  },
};
</script>

<style lang="scss" src="@/styles/index.scss" />
