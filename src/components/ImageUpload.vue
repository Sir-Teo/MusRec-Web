<script setup>
</script>

<template>
  <div class="greetings">
    <h1 class="green"></h1>
    <h3>
      Upload an image using the button below, our model will then recommend you with the best matched music!
    </h3>
    <input type="file" @change="onChange($event)">
  </div>

  <div id="preview">
    <img v-if="url" :src="url" />
  </div>
 
</template>

<script>
export default {
    props: ['modelValue'],
    data() {
    return {
      url: null,
    }
  },
    methods: {
        onChange(event) {
            const file = event.target.files[0]
            this.$emit('update:modelValue', file);
            this.url = URL.createObjectURL(file);
            URL.revokeObjectURL(file);
            console.log(this.url);
        },
    },
};
</script>



<style scoped>


#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 100%;
  max-height: 500px;
}



h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
