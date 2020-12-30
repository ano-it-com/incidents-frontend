<template>
  <div
    class="editor"
    :class="[$options.name, { containerized }]"
  >
    <editor-floating-menu v-if="floating" :editor="editor" v-slot="{ commands, isActive, menu }">
      <div
        class="editor__floating-menu"
        :class="{ 'is-active': menu.isActive }"
        :style="`top: ${menu.top}px`"
      >

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>
      </div>
    </editor-floating-menu>

    <editor-menu-bar v-else-if="hasToolbar" :editor="editor" v-slot="{ commands, isActive }">
      <div class="default-toolbar">
        <div
          :class="{ 'is-active': isActive.bold() }"
          class="default-toolbar__button"
          @click="commands.bold"
        >
          <icon name="editor-bold" />
        </div>

        <div
          :class="{ 'is-active': isActive.italic() }"
          class="default-toolbar__button"
          @click="commands.italic"
        >
          <icon name="editor-italic" />
        </div>

        <div
          :class="{ 'is-active': isActive.strike() }"
          class="default-toolbar__button"
          @click="commands.strike"
        >
          <icon name="editor-strike" />
        </div>

        <div
          :class="{ 'is-active': isActive.underline() }"
          class="default-toolbar__button"
          @click="commands.underline"
        >
          <icon name="editor-underline" />
        </div>

        <div
          :class="{ 'is-active': isActive.code() }"
          class="default-toolbar__button"
          @click="commands.code"
        >
          <icon name="editor-code" />
        </div>

        <div
          :class="{ 'is-active': isActive.paragraph() }"
          class="default-toolbar__button"
          @click="commands.paragraph"
        >
          <icon name="editor-paragraph" />
        </div>
      </div>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import uniqueId from 'lodash/uniqueId';
import {
  Editor,
  EditorContent,
  EditorFloatingMenu,
  EditorMenuBar,
} from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  Image,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder,
} from 'tiptap-extensions';

export default {
  name: 'text-editor-component',
  components: { EditorContent, EditorFloatingMenu, EditorMenuBar },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    id: {
      type: String,
      default: uniqueId('editor'),
    },
    value: {
      type: String,
      default: null,
    },
    floating: Boolean,
    hasToolbar: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: 'Введите текст',
    },
    containerized: Boolean,
  },
  data: () => ({
    editor: null,
  }),
  created() {
    const self = this;
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new Image(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.placeholder,
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
      ],
      content: this.value,
      onInit() { self.$emit('ready', this); },
      onUpdate: ({ getHTML }) => {
        this.$emit('input', getHTML());
      },
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.editor {
  position: relative;

  &__floating-menu {
    position: absolute;
    z-index: 1;
    margin-top: -0.20rem;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &.is-active {
      opacity: 1;
      visibility: visible;
    }
  }

  &.containerized {
    position: relative;
    background-color: $light-gray;
    height: 180px;
    max-height: 240px;
    width: 100%;
    border: 1px solid $gray-blue-border;
    margin: 0!important;
    font-size: 12px;
    overflow: scroll;

    .editor__content {
      padding: 8px;
    }

    .editor__content, .ProseMirror {
      height: 100%;
    }

    > div:not(.ProseMirror-focused) {
      p.is-editor-empty:first-child::before {
        color: #9F9F9F;
      }
    }
  }

  .default-toolbar {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding: 3px 8px;
    background-color: white;
    border-bottom: 1px solid $gray-blue-border;
    z-index: 2;

    &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 22px;
      width: 22px;
      cursor: pointer;
      border-radius: 2px;

      &.is-active, &:hover {
        background-color: $gray-blue-border;
      }
      & + .default-toolbar__button {
        margin-left: 2px;
      }
    }
  }
}

.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;

  &.is-hidden {
    visibility: hidden;
    opacity: 0;
  }

  &.is-focused {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s, opacity 0.2s;
  }

  &__button {
    display: inline-flex;
    background: $blue;
    border: 0;
    color: $white;
    padding: 0.2rem 0.5rem;
    margin-right: 0.2rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba($blue, 0.9);
    }

    &.is-active {
      background-color: rgba($blue, 0.9);
    }
  }

  span#{&}__button {
    font-size: 13.3333px;
  }
}
</style>
