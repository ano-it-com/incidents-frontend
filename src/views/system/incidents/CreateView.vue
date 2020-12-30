<template>
  <div :class="$options.name">
    <header class="header header-creation">
      <div class="container">
        <div class="header-creation__title">
          {{ isEditing ? 'Редактирование инцидента' : 'Создание инцидента' }}
        </div>
        <div class="header-creation__box">
          <button-component
            label="Отмена"
            @click="$router.push({ name: 'incidents-list' })"
          />
          <button-component
            inverse
            label="Сохранить"
            bordered
            @click="onIncidentSave"
          />
        </div>
      </div>
    </header>
    <div class="content">
      <section class="creation">
        <div class="editor-toolbar">
          <editor-menu-bar :editor="editorObject" v-slot="{ commands, isActive }">
            <div class="list-commands">
              <div
                :class="{ 'is-active': isActive.bold() }"
                class="list-commands__button"
                @click="commands.bold"
              >
                <icon name="editor-bold" />
              </div>

              <div
                :class="{ 'is-active': isActive.italic() }"
                class="list-commands__button"
                @click="commands.italic"
              >
                <icon name="editor-italic" />
              </div>

              <div
                :class="{ 'is-active': isActive.strike() }"
                class="list-commands__button"
                @click="commands.strike"
              >
                <icon name="editor-strike" />
              </div>

              <div
                :class="{ 'is-active': isActive.underline() }"
                class="list-commands__button"
                @click="commands.underline"
              >
                <icon name="editor-underline" />
              </div>

              <div
                :class="{ 'is-active': isActive.code() }"
                class="list-commands__button"
                @click="commands.code"
              >
                <icon name="editor-code" />
              </div>

              <div
                :class="{ 'is-active': isActive.paragraph() }"
                class="list-commands__button"
                @click="commands.paragraph"
              >
                <icon name="editor-paragraph" />
              </div>

              <div
                class="list-commands__button"
                @click="showImagePrompt(commands.image)"
              >
                <icon name="editor-image" />
              </div>

              <div
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                class="list-commands__button"
                @click="commands.heading({ level: 1 })"
              >
                H1
              </div>

              <div
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                class="list-commands__button"
                @click="commands.heading({ level: 2 })"
              >
                H2
              </div>

              <div
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                class="list-commands__button"
                @click="commands.heading({ level: 3 })"
              >
                H3
              </div>

              <div
                :class="{ 'is-active': isActive.bullet_list() }"
                class="list-commands__button"
                @click="commands.bullet_list"
              >
                <icon name="editor-ul" />
              </div>

              <div
                :class="{ 'is-active': isActive.ordered_list() }"
                class="list-commands__button"
                @click="commands.ordered_list"
              >
                <icon name="editor-ol" />
              </div>

              <div
                :class="{ 'is-active': isActive.blockquote() }"
                class="list-commands__button"
                @click="commands.blockquote"
              >
                <icon name="editor-quote" />
              </div>

              <div
                :class="{ 'is-active': isActive.code_block() }"
                class="list-commands__button"
                @click="commands.code_block"
              >
                <icon name="editor-code" />
              </div>

              <div
                class="list-commands__button"
                @click="commands.horizontal_rule"
              >
                <icon name="editor-hr" />
              </div>

              <div
                class="list-commands__button"
                @click="commands.undo"
              >
                <icon name="editor-undo" />
              </div>

              <div
                class="list-commands__button"
                @click="commands.redo"
              >
                <icon name="editor-redo" />
              </div>
            </div>
          </editor-menu-bar>
        </div>
        <div class="container">
          <div class="creation-box creation-title-input">
            <input v-model.trim="form.title" type="text" placeholder="Введите название инцидента">
          </div>

          <div class="creation-box description">
            <text-editor-component
              @ready="onEditorReady"
              v-model="form.description"
              :has-toolbar="false"
            />
          </div>

          <div class="creation-box file-upload">
            <h2 class="title creation-title">Файлы</h2>
            <file-manager-component
              v-model="form.files"
              :already-uploaded="form.addedFiles"
              centered
            />
          </div>

          <div class="creation-box incident-information">
            <h2 class="title creation-title">Тип инцидента</h2>

            <incident-type-selector
              v-model="form.typeId"
              :items="incidentTypes"
              @change="form.typeHandler = $event.handler"
            />
          </div>

          <template v-if="form.typeId">
            <div class="creation-box incident-information">
              <h2 class="title creation-title">Информация об инциденте</h2>

              <handler-properties-resolver
                :key="form.typeHandler"
                v-model="form.info"
                :handler="getTypeHandler(form.typeHandler)"
                :values="form.infoValues"
                type="edit"
              />
            </div>

            <div class="creation-box incident-actions">
              <h2 class="title creation-title">Действия</h2>

              <template v-if="!form.actions.length">
                <div class="creation__act-empty">
                  <div class="btn btn-blue btn-add">
                    <button-component
                      label="Добавить действие"
                      icon="plus"
                      inverse
                      @click="onAddActionClick"
                    />
                  </div>

                  <span>или</span>

                  <dropdown-button-component :list="templates" @selected="fillActionsFromTemplate">
                    Заполнить из шаблона
                  </dropdown-button-component>
                </div>
              </template>
              <template v-else>
                <dropdown-button-component class="creation__act-add">
                  <i>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path d="M5,11V7H1A1,1,0,0,1,1,5H5V1A1,1,0,0,1,7,1V5h4a1,1,0,0,1,0,2H7v4a1,1,0,0,1-2,0Z"></path></svg>
                  </i>
                  Добавить
                  <template v-slot:list>
                    <li @click="onAddActionClick">Новое действие</li>
                    <template v-if="templates.length">
                      <li class="list-header">Шаблоны</li>
                      <li
                        v-for="(template, index) in templates"
                        :key="index"
                        @click="fillActionsFromTemplate(template)"
                      >
                        {{ template.title }}
                      </li>
                    </template>
                  </template>
                </dropdown-button-component>

                <create-incident-actions-list
                  :list="form.actions"
                  :handler-id="form.typeHandler"
                  @edit="onActionEditEvent"
                />
              </template>
            </div>
          </template>
        </div>
      </section>
    </div>

    <action-manager
      :action-types="getTypeActionTypes(form.typeHandler)"
      :responsible-groups="creationMeta.groups"
      :current-action="currentEditableAction"
      :class="{ open: actionManagerOpened }"
      @saved="onActionSaved"
      @updated="onActionUpdated"
      @close="onActionManagerClose"
    />

    <footer class="footer footer-creation">
      <div class="container">
        <div class="footer-creation__box">
          <button-component
            label="Отмена"
            bordered
            @click="$router.push({ name: 'incidents-list' })"
          />
          <button-component
            inverse
            label="Сохранить"
            bordered
            @click="onIncidentSave"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
import { EditorMenuBar } from 'tiptap';
import each from 'lodash/each';
import ButtonComponent from '@/components/UI/Button';
import DropdownButtonComponent from '@/components/UI/DropdownButton';
import TextEditorComponent from '@/components/UI/TextEditor';
import FileManagerComponent from '@/components/FileManager';
import HandlerPropertiesResolver from '@/components/HandlerPropertiesResolver';
import IncidentTypeSelector from './components/IncidentTypeSelector.vue';
import CreateIncidentActionsList from './components/CreateIncidentActionsList.vue';
import ActionManager from './CreateView/ActionManager.vue';

const createDefaultForm = () => ({
  title: null,
  description: null,
  typeId: null,
  typeHandler: null,
  info: [],
  files: [],
  actions: [],
  responsibleGroups: [1],
});

export default {
  name: 'incidents-create-view',
  async asyncData({ store, route }) {
    if (route.name === 'incidents-edit') {
      const id = +route.params.id;
      await store.dispatch('incidents/getItem', id);
    }
    await store.dispatch('incidents/getMeta');
  },
  components: {
    ButtonComponent,
    DropdownButtonComponent,
    TextEditorComponent,
    EditorMenuBar,
    FileManagerComponent,
    IncidentTypeSelector,
    CreateIncidentActionsList,
    HandlerPropertiesResolver,
    ActionManager,
  },
  data: () => ({
    form: createDefaultForm(),
    editorObject: null,
    actionManagerOpened: false,
    currentEditableAction: null,
  }),
  computed: {
    ...mapGetters('incidents', ['incidentTypes', 'getTypeHandler', 'getTypeActionTypes']),
    ...mapState('incidents', ['creationMeta', 'single']),

    templates() {
      if (this.form.typeId && this.creationMeta) {
        return this.creationMeta.templates.filter((_) => _.incident_type_id === this.form.typeId);
      }
      return [];
    },

    isEditing() {
      return this.$route.name === 'incidents-edit';
    },
  },
  beforeRouteLeave(to, from, next) {
    this.setClosedLayoutState();
    next();
  },
  created() {
    if (this.isEditing && this.single) {
      const actions = [];
      each(this.single.actions, (action) => {
        actions.push({
          ...action,
          typeId: action.type.id,
          isTemplate: !!action.templateId,
          isOld: true,
          responsibleGroup: action.responsibleGroup.id,
          templateId: action.templateId,
          tasks: [
            ...action.actionTasks.map((task) => ({
              ...task,
              typeId: task.type.id,
            })),
          ],
        });
      });

      this.form = {
        ...createDefaultForm(),
        ...this.single,
        addedFiles: [...this.single.files],
        infoValues: [...this.single.info],
        typeHandler: this.single.type.handler,
        typeId: this.single.type.id,
        responsibleGroups: [1],
        actions,
      };
    }
  },
  methods: {
    ...mapActions('incidents', ['createItem', 'updateItem']),
    ...mapActions('system', ['setOpenedLayoutState', 'setClosedLayoutState']),

    onEditorReady(editorObject) {
      this.editorObject = editorObject;
    },

    async onIncidentSave() {
      const actions = [];
      const individualActions = this.form.actions.filter((_) => !_.isTemplate && !_.isOld);

      each(individualActions, (action) => {
        const existing = actions.find((_) => _.typeId === action.typeId);

        if (!existing) {
          actions.push({ ...action, responsibleGroup: [action.responsibleGroup] });
          return;
        }

        existing.responsibleGroup.push(action.responsibleGroup);
      });

      const templates = [];
      const templateActions = this.form.actions.filter((_) => _.isTemplate && !_.isOld);
      each(templateActions, (action) => {
        const existing = templates.find((_) => _.templateId === action.templateId);

        if (!existing) {
          templates.push({
            templateId: action.templateId,
            actions: [
              { actionTypeId: action.typeId, groupId: action.responsibleGroup },
            ],
          });
          return;
        }

        existing.actions.push({ actionTypeId: action.typeId, groupId: action.responsibleGroup });
      });

      const data = {
        ...this.form,
        actions,
        templates,
      };

      if (this.isEditing) {
        await this.updateItem(data);
      } else {
        await this.createItem(data);
      }
    },

    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here');
      if (src !== null) {
        command({ src });
      }
    },

    onActionSaved(action) {
      this.form.actions.push(action);
    },

    onActionUpdated({ updated, old }) {
      const oldActionIndex = this.form.actions.indexOf(old);
      this.$set(this.form.actions, oldActionIndex, updated);
    },

    onAddActionClick() {
      this.actionManagerOpened = true;
      this.setOpenedLayoutState();
    },

    onActionManagerClose() {
      this.actionManagerOpened = false;
      this.currentEditableAction = null;
      this.setClosedLayoutState();
    },

    onActionEditEvent(action) {
      this.currentEditableAction = Object.freeze(action);
      this.actionManagerOpened = true;
      this.setOpenedLayoutState();
    },

    fillActionsFromTemplate(template) {
      const templateActions = [];
      template.actions.forEach((templateAction) => {
        templateActions.push({
          typeId: templateAction.id,
          responsibleGroup: templateAction.responsibleGroup.id,
          tasks: [
            ...templateAction.task_types
              .map((task) => ({ typeId: task.id, inputData: { description: task.title } })),
          ],
          isTemplate: true,
          templateId: template.id,
        });
      });

      const actionsForAdding = templateActions.filter((action) => {
        const sameExistedAction = this.form.actions
          .find((existAction) => existAction.typeId === action.typeId);

        return !(sameExistedAction
          && sameExistedAction.responsibleGroup
          === action.responsibleGroup
        );
      });

      this.form.actions = [...this.form.actions, ...actionsForAdding];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.incidents-create-view {
  min-height: calc(100vh - 112px);
  margin-top: -($mm-value * 7) + px;
}

.header-creation {
  &__title {
    font-family: 'Ruda', sans-serif;
    font-weight: 800;
    font-size: 21px;
    line-height: 21px;
    color: $white;
  }

  &__box {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    * + * {
      margin-left: 12px;
    }
  }
}

.footer-creation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: $white;
  border-top: 1px solid $gray-blue-border;
  z-index: 2;

  & .container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 56px;
    max-width: 974px;
    min-width: 974px;
  }

  &__box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    button {
      width: 130px;
    }
    * + * {
      margin-left: 12px;
    }
  }
}

.creation {
  position: relative;
  padding: 74px;

  &-title {
    font-size: 21px;
    line-height: 32px;
    margin-bottom: 20px;
  }

  &-box {
    position: relative;
    margin-bottom: 24px;
  }

  &-title-input {
    input {
      width: 100%;
      font-size: 28px;
      font-weight: 400;
      color: #000;
      border: 0;
      outline: none;

      &::placeholder {
        color: $placeholder-color;
      }
    }
  }

  &__row {
    position: relative;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;

    &.two {
      z-index: 1;
      & .creation__item {
        margin-right: 36px;
        width: calc(50% - 18px);
      }
    }

    &.four {
      z-index: 1;
      & .creation__item {
        margin-right: 36px;
        width: calc(25% - 18px);
      }
    }

      .creation__item {
        &-label {
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          margin-bottom: 7px;
        }
      }
  }

  &__radio{
    display: flex;
    align-items: center;
    height: 32px;
  }

  &__act{
    &-add {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 5;
      width: 144px;
    }
    &-empty{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90px;
      border-radius: 2px;
      background-color: $light-gray;
      & span{
        font-size: 12px;
        font-weight: 500;
        margin: 0 15px;
      }
    }
  }
}

.editor-toolbar {
  position: fixed;
  left: 0;
  top: 56px;
  width: 100%;
  padding: 3px 0;
  z-index: 2;
  border-bottom: 1px solid $gray-blue-border;

  .list-commands {
    display: flex;
    justify-content: center;
    align-items: center;

    &__button {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      background-color: transparent;
      transition: background-color .2s;
      cursor: pointer;
      user-select: none;

      &.is-active {
        background-color: $gray-blue-border;
      }

      &:hover {
        background-color: $gray-blue-border;
      }

      & + .list-commands__button {
        margin-left: 3px;
      }
    }
  }
}

.radio {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  margin-right: 12px;

  & input {
    position: absolute;
    width: 26px;
    height: 26px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: -1;
    opacity: 0;

    &:checked + .radio__box:before {
      width: 32px;
      height: 32px;
      border: 1px solid $blue;
      transition: border 0.5s, width 0.5s, height 0.5s;
    }
  }

  &__box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 2px solid $white;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
    color: $black;
    text-align: center;
    height: 26px;
    width: 26px;
    cursor: pointer;
    z-index: 2;

    &-1 {
      background-color: $green;
    }

    &-2 {
      background-color: $yellow;
    }

    &-3 {
      background-color: $red2;
    }

    &-4 {
      background-color: $gray;
    }

    &:before {
      content: '';
      position: absolute;
      border: 1px solid transparent;
      width: 0;
      height: 0;
      border-radius: 50%;
      transition: border 0.5s, width 0.5s, height 0.5s;
    }
  }
}

</style>
