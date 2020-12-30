<template>
  <label :for="id" :class="[$options.name, { centered, 'drag-over': dragOver }]">
    <div
      class="drag-n-drop-zone"
      @dragenter.prevent.stop="dragOver = true"
      @dragover.prevent.stop="dragOver = true"
      @dragleave.prevent.stop="dragOver = false"
      @dragexit.prevent.stop="dragOver = false"
      @drop.prevent.stop="onFileSelected"
    />

    <div class="upload-region-component__info">
      <icon name="upload" :size="28" class="upload-icon" />

      <div class="upload-region-component__text">
        <span>Загрузите файлы</span> <br>
        Перетащите в это поле или выберите файлы
      </div>
    </div>

    <button-component class="button" inverse label="Выбрать файлы" />

    <input
      :id="id"
      type="file"
      multiple
      @change="onFileSelected"
    />
  </label>
</template>

<script>
import uniqueId from 'lodash/uniqueId';
import ButtonComponent from '@/components/UI/Button';

export default {
  name: 'upload-region-component',
  components: { ButtonComponent },
  props: {
    centered: Boolean,
  },
  data: () => ({
    dragOver: false,
    id: uniqueId('file-uploader-'),
  }),
  methods: {
    onFileSelected(event) {
      this.dragOver = false;
      const files = Array.from(event.type === 'drop' ? event.dataTransfer.files : event.target.files);
      this.$emit('selected', files);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/partials/params";
@import "~@/styles/partials/mixins";

.upload-region-component {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 90px;
  background-color: $white;
  border: 1px dashed $gray-blue-border;
  border-radius: 2px;
  cursor: pointer;
  padding: 0 28px;
  transition: border-color .3s, box-shadow .3s;

  &.drag-over {
    border-color: rgba($blue, 0.38);
    box-shadow: 0 5px 20px rgba($blue, 0.38)
  }

  .drag-n-drop-zone {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }

  .button {
    width: 128px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 60px;

    & .upload-icon {
      fill: $close-color;
    }
  }

  &.centered {
    .upload-region-component__info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }

  &__text {
    font-size: 13px;
    line-height: 16px;
    margin-left: 16px;
    font-weight: 400;

    & span {
      font-weight: 800;
      font-family: 'Ruda', sans-serif;
      color: $darkblue;
      font-size: 14px;
      line-height: 22px;
    }
  }

  input[type="file"] {
    position: absolute;
    left: -100000000px;
  }
}
</style>
