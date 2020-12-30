<template>
  <div :class="$options.name">
    <upload-region-component v-if="!readOnly" :centered="centered" @selected="onFilesSelected"/>

    <div v-if="files && files.length" class="files-row">
      <div
          v-for="(item, index) in files"
          :key="index"
          class="file-item"
      >
        <img src="~@/assets/icon-pdf.png">
        <div class="file-item__info">
          <div class="file-item__name">{{ item.file.name || item.file.originalName }}</div>

          <template v-if="item.uploading">
            <div
              class="file-item__action"
              :class="fileItemClasses(item)"
            >
              <icon name="time" :size="8"/>
              Загрузка...
            </div>
          </template>
          <template v-if="item.uploaded && !item.withError">
            <div
              class="file-item__action"
              :class="fileItemClasses(item)"
              @click="remove(index, 'Удалить загруженный файл?')"
            >
              <icon name="trash" :size="8"/>
              Удалить
            </div>
          </template>
          <template v-if="item.withError">
            <div
              class="file-item__action"
              :class="fileItemClasses(item)"
              @click="remove(index)"
            >
              <icon name="close" :size="8"/>
              Ошибка при загрузке
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import UploadRegionComponent from './UploadRegion.vue';

export default {
  name: 'file-manager-component',
  components: { UploadRegionComponent },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Array,
      default: () => ([]),
    },
    alreadyUploaded: Array,
    returnObject: Boolean,
    centered: Boolean,
    readOnly: Boolean,
  },
  data: () => ({
    files: [],
  }),
  computed: {
    getFileName() {
      return (item) => (this.returnObject ? item.file.file.name : item.originalName);
    },

    fileItemClasses() {
      return (item) => ({
        uploading: item.uploading,
        error: item.withError,
        uploaded: item.uploaded && !item.withError,
      });
    },
  },
  watch: {
    alreadyUploaded: {
      immediate: true,
      deep: true,
      handler(value) {
        if (!value || !value.length) return;
        this.$emit('input', this.returnObject ? value : value.map((_) => _.id));
      },
    },
  },
  created() {
    // todo
    this.files = this.value
      .filter((_) => typeof _ === 'object')
      .map((_) => ({
        file: {
          id: _.id,
          name: _.name || _.originalName,
        },
        uploaded: true,
        uploading: false,
        uploadedId: _.id,
        withError: false,
      }));
  },
  methods: {
    // todo move uploadFile function to utils file, bcz handle this method in store so ambiguous
    ...mapActions('incidents', ['uploadFile']),

    async onFilesSelected(files) {
      const filesArray = (files || []).map((_) => ({
        file: _,
        uploaded: false,
        uploading: true,
        uploadedId: null,
        withError: false,
      }));
      this.files = [...this.files, ...filesArray];

      const uploaded = [];
      const self = this;

      const promisedHandler = async (item) => {
        if (item.uploaded) {
          uploaded.push(this.fileToUploadedType(item));
          return;
        }

        try {
          // eslint-disable-next-line no-param-reassign
          item.uploadedId = await self.uploadFile(item.file);
          // eslint-disable-next-line no-param-reassign
          item.uploaded = true;
          uploaded.push(this.fileToUploadedType(item));
        } catch (e) {
          // eslint-disable-next-line no-param-reassign
          item.withError = true;
          console.log(item);
          // todo do something
        } finally {
          // eslint-disable-next-line no-param-reassign
          item.uploading = false;
        }
      };

      const promisedActions = this.files.map((file) => promisedHandler(file));
      await Promise.all(promisedActions);
      this.$emit('input', uploaded);
    },
    remove(i, confirmationMessage = null) {
      // eslint-disable-next-line no-restricted-globals
      if (!confirmationMessage || (confirmationMessage && confirm(confirmationMessage))) {
        this.files.splice(i, 1);
        this.$emit(
          'input',
          this.files.filter((_) => _.uploaded).map((_) => this.fileToUploadedType(_)),
        );
      }
    },
    fileToUploadedType(file) {
      return this.returnObject
        ? {
          uploadedId: file.uploadedId,
          file: file.file,
        }
        : file.uploadedId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.file-manager-component {
  .files-row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 20px;
  }

  .file-item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: .3s;
    margin-bottom: 15px;
    width: calc(25% - 18px);
    margin-right: 12px;

    img {
      width: 53px;
      min-width: 53px;
    }

    &__info, &__name {
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      width: calc(100% - 60px);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-left: 4px;
    }

    &__name {
      -webkit-line-clamp: 3;
      margin: 0;
      width: 100%;
    }

    &__action {
      font-size: 11px;
      font-weight: 500;
      line-height: 22px;
      cursor: pointer;

      &.uploaded, &.error {
        color: $red;
      }

      &.uploading {
        color: $green;
      }
    }
  }
}
</style>
