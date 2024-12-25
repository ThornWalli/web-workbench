<template>
  <div class="wb-disks-extras13-base64-converter">
    <p>
      The display is truncated if the length exceeds {{ maxChars }} characters.
    </p>
    <wb-form class="form">
      <wb-form-field-textfield
        :model-value="mimeType"
        placeholder="MimeType"
        label="MimeType"
        @update:model-value="onInputMimeType">
        <template #after>
          <wb-button
            style-type="secondary"
            label="COPY"
            @click="onClickCopy('base64')" />
        </template>
      </wb-form-field-textfield>
      <wb-form-field-textfield
        :model-value="prepareDisplayValue(base64)"
        placeholder="Base64…"
        label="Base64"
        @update:model-value="onInputBase64">
        <template #after>
          <wb-button
            style-type="secondary"
            label="COPY"
            @click="onClickCopy('base64')" />
        </template>
      </wb-form-field-textfield>
      <wb-form-field-textfield
        :model-value="prepareDisplayValue(dataUrl)"
        placeholder="Data Url"
        label="Data Url"
        @update:model-value="onInputdataUrl">
        <template #after>
          <wb-button
            style-type="secondary"
            label="COPY"
            @click="onClickCopy('dataUrl')" />
        </template>
      </wb-form-field-textfield>
      <wb-form-field-textfield
        :model-value="prepareDisplayValue(plainText)"
        placeholder="Plain Text…"
        label="Plain Text"
        @update:model-value="onInputPlainText">
        <template #after>
          <wb-button
            style-type="secondary"
            label="COPY"
            @click="onClickCopy('plainText')" />
        </template>
      </wb-form-field-textfield>
      <div class="buttons">
        <wb-button
          v-model="files"
          :accept="null"
          type="upload"
          label="Upload File" />
        <wb-button
          :disabled="invalidMimeType"
          style-type="secondary"
          label="Download"
          @click="onClickDownload" />
      </div>
    </wb-form>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import contextMenu from '../contextMenu';
import useWindow from '@web-workbench/core/composables/useWindow';
import WbForm from '@web-workbench/core/components/molecules/Form';
import WbFormFieldTextfield from '@web-workbench/core/components/atoms/formField/Textfield';
import WbButton from '@web-workbench/core/components/atoms/Button';

const windowContext = useWindow();
windowContext.setContextMenu(contextMenu);

const maxChars = ref(500);

const prepareDisplayValue = value => {
  if (value?.length > maxChars.value) {
    return `${value.slice(0, maxChars.value)}...`;
  }
  return String(value);
};

const dataUrl = ref('data:text/plain;base64,');
const files = ref(null);
const base64 = computed(() => {
  try {
    return btoa(dataUrl.value.split(',')[1]);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error('Error converting plain text to base64', error);
    return 'ERROR!';
  }
});

const plainText = computed(() => {
  try {
    return atob(dataUrl.value.split(',')[1]);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error('Error converting plain text to base64', error);
    return 'ERROR!';
  }
});

const mimeType = computed(() => {
  try {
    return dataUrl.value.split(':')[1].split(';')[0];
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error('Error converting plain text to base64', error);
    return 'ERROR!';
  }
});

const invalidMimeType = computed(() => {
  return mimeType.value === 'ERROR!';
});

watch(
  () => files.value,
  files => {
    if (files?.length) {
      const reader = new FileReader();
      reader.onload = e => (dataUrl.value = e.target.result);
      reader.readAsDataURL(files[0]);
    }
  }
);

const onClickDownload = async () => {
  const FileSaver = await import('file-saver').then(module => module.default);

  try {
    const blob = new Blob([dataURLtoBlob(dataUrl.value)], {
      type: 'application/json;charset=utf-8'
    });
    await FileSaver.saveAs(blob, `file.${mimeType.value}`);
  } catch (error) {
    console.error('An error occurred during export.', error);
  }
};

const onInputPlainText = e => {
  try {
    dataUrl.value = `data:text/plain;base64,${btoa(e)}`;
  } catch (error) {
    console.error('Error converting plain text to base64', error);
  }
};

const onInputdataUrl = e => {
  try {
    dataUrl.value = e;
  } catch (error) {
    console.error('Error converting plain text to base64', error);
  }
};

const onInputBase64 = e => {
  try {
    dataUrl.value = `data:text/plain;base64,${e}`;
  } catch (error) {
    console.error('Error converting plain text to base64', error);
  }
};

const onInputMimeType = e => {
  try {
    dataUrl.value = `data:${e};base64,${base64.value}`;
  } catch (error) {
    console.error('Error converting plain text to base64', error);
  }
};

const onClickCopy = type => {
  try {
    switch (type) {
      case 'base64':
        navigator.clipboard.writeText(base64.value);
        break;
      case 'dataUrl':
        navigator.clipboard.writeText(dataUrl.value);
        break;
      case 'plainText':
        navigator.clipboard.writeText(plainText.value);
        break;
    }
  } catch (error) {
    console.error('Error copying to clipboard', error);
  }
};

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[Number(n)] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
</script>

<style lang="postcss" scoped>
.wb-disks-extras13-base64-converter {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 480px;
  padding: var(--default-element-margin);
}

.wb-env-atom-button {
  flex: 0;
  width: auto;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: var(--default-element-margin);
}

p {
  line-height: calc(20 / var(--global-font-size) * 1em);
}
</style>
