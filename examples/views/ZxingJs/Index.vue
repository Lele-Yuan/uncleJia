<template>
    <p>
        <img ref="img" :src="imgUrl" alt="二维码" style="width: 100px; height: 100px; border: 1px solid gray"></img>
    </p>
    <p style="width: 500px; word-break: break-all; margin: auto;">
        imgUrl: {{ imgUrl }}
    </p>
    <div>
        <button @click="handleQrRender">识别</button>
    </div>
    <div>
        <label>Result:</label>
        <p style="width: 200px; word-break: break-all; margin: auto;">{{ textContent }}</p>
    </div>
</template>
<script lang="ts" setup>
import {BrowserQRCodeReader} from "@zxing/browser";
import { ref } from "vue";
const img = ref<HTMLImageElement | null>(null);
const imgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAAD1AQMAAACyfyEmAAAABlBMVEUAAAD///+l2Z/dAAADIElEQVRYhc1ZQa6rMAw0YpElR8hN4GJIIPVi9CY5QpdZVPWfGafVk/4BDIsKMiyC4xmPXTNctW+v3cpls+PuaGaLOx6/VyZe3N8VP97K82UV0MnH08oTizfAL9trN9utT1i1FY+Evq/fAsf97IYgV5u469WO5jfCsXZW/yxnpAPi+/C74Dx/2/DjevNaHq1P+BL/kx+JeGz4+dr/+/nDr0TceTE1EVUElLtu8TkC0nEjdbDhA4Rxnf/cHG9aXxnpdBxZiVzkqUt1AM2t4NGJez6u/eP+zUhzYUG6Mj9JopaPgzUzQ6tVhPYCjv2fEXO7AY4F5CcFG/tn6WtiuulL7oA7BecY+AYSlQ8rNctNT8dRUN5MUkaVTMLnGM/fOkjO7EjGITiPxqNnQZG/UREc+pOPlw8NzfMlEZo9UtO5dUTa8vFvap4sgtAfvtllwpQE6ThpgrNGVuJ+DlX0UWnIn2w8tFpFhvmpVcRcJJ+hj9l40IS1DqvI1O1nHVYKUzpO6+84a1w8/2ASayISg/UlG+9rkOjNSrObWqch3XrMxlnmyOoHXQ1dq/SHdHcA+XgcOE12pCaLzOjvXrvl4zh67F/WcBOr6RpIctnZno7bOjaprkR2bJjscSXjEETxhzhDO6yN5Dz4k4yzzNHksCve43X5f/Xv+bgMvwJK1Y6uOPRnXeTPknFptTO+TpGEnLuagK8cZeO4Z1UJ/zD8NZgE6Zn0mI0bw6j8lD+k/mg08xssJeOqf9zrr4kK/Wnq+SwdZxrS0JyyNkoHThqO6PTycafXUpMS+kNq+1OdvI/5QipOa1Mp4jWsNVOz0+QEkI6DxoeLMOX6TqXHS+BUT8f7Fm3wbmESpzCJuxr7EKRcnIaQAW0a/Q7/FTNN93w8emGuqupBHzX6nekf1N8l42rTKT28O2tIIzkFJu2Wj/Niw6SC8v7dRU9fLR2XtY7zp9P2y2LmIP/fboDLEKKquCCdfx/eVfXvDngZ89+HTl3+q1nMHG6Bq76UmBS6RgvRk1bLx/X/IYcgJaoe9i/9xiuH5+PiD87fYjSjrkQk50zT0vF/nllJIsSQZMAAAAAASUVORK5CYII=';
const textContent = ref<string>('');
const handleQrRender = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.decodeFromImageUrl(imgUrl).then((result) => {
        console.log(result)
        textContent.value = result.getText();
    }).catch((err) => {
        console.error(err)
        textContent.value = err
    })
    console.log(`Started decode for image from ${imgUrl}`)
}

</script>

<style lang="less" scoped>

</style>
