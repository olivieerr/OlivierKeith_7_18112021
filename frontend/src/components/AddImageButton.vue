<template>
  <label class="addImage">
    <font-awesome-icon
      class="ms-1"
      :icon="['fas', 'image']"
      size="2x"
      for="imageFile"
    />
    <span class="add-img">
      <span class="title-image">Ajouter image</span>
      <input
        accept="image/*"
        type="file"
        id="FileInput"
        ref="image"
        name="image_attachment_upload"
        v-on:change="handleFileUpload()"
      />
    </span>
  </label>
</template>

<script>
export default {
  name: "AddImageButton",

  data() {
    return {
      image: "",
    };
  },

  methods: {
    handleFileUpload() {
      this.image = this.$refs.image.files[0];
    },
  },
};
</script>

<style lang="scss" scoped>
#FileInput {
  display: none;
}

.addImage {
  margin: 5px;
  color: grey;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
    box-sizing: border-box;
    border-radius: 5px !important;
    input {
      display: inline-block;
      margin-right: 5px;
      height: 100% !important;
    }
  &:hover .title-image {
    color: rgb(5, 47, 160);
  }
  .title-image {
    margin: 0 5px 0 5px;
    color: #575757;
  }
}

</style>